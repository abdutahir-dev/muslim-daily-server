import sqlite3
import os
import re

# --- Configuration ---
SOURCE_DIR = './databases'
# Keep the master file OUTSIDE the source dir to avoid self-referencing locks
MASTER_DB_PATH = './muslimdaily_master.sqlite' 

def get_columns(cursor, alias, table_name):
    """Retrieves columns safely."""
    cursor.execute(f"PRAGMA {alias}.table_info(\"{table_name}\")")
    return [row[1] for row in cursor.fetchall() if row[1].lower() != 'id']

def migrate_data():
    # 'isolation_level=None' turns off automatic transactions for cleaner ATTACH/DETACH
    master_conn = sqlite3.connect(MASTER_DB_PATH, timeout=60, uri=True)
    master_conn.isolation_level = None 
    master_cursor = master_conn.cursor()

    db_files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(('.sqlite', '.db'))]
    
    # Filter out the master file just in case it's in the same folder
    db_files = [f for f in db_files if f not in MASTER_DB_PATH]

    print(f"Starting migration of {len(db_files)} databases...")

    for db_file in db_files:
        db_path = os.path.abspath(os.path.join(SOURCE_DIR, db_file))
        alias = "src_" + re.sub(r'[^a-zA-Z0-9]', '_', os.path.splitext(db_file)[0])
        
        try:
            # 1. Attach
            master_cursor.execute(f"ATTACH DATABASE 'file:{db_path}?mode=ro' AS {alias}")

            # 2. Get tables
            master_cursor.execute(f"SELECT name FROM {alias}.sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
            tables = [row[0] for row in master_cursor.fetchall()]

            # 3. Start a manual transaction for this specific file
            master_cursor.execute("BEGIN TRANSACTION")

            for table in tables:
                columns = get_columns(master_cursor, alias, table)
                if not columns: continue
                
                col_names = ", ".join(f'"{c}"' for c in columns)
                
                # Ensure table exists in master
                # master_cursor.execute(f"CREATE TABLE IF NOT EXISTS \"{table}\" AS SELECT * FROM {alias}.\"{table}\" WHERE 1=0")
                master_cursor.execute(f"CREATE TABLE IF NOT EXISTS {table} AS SELECT * FROM {alias}.{table} WHERE 1=0")
                
                # Move the data
                #master_cursor.execute(f"INSERT INTO \"{table}\" ({col_names}) SELECT {col_names} FROM {alias}.\"{table}\"")
                master_cursor.execute(f"INSERT OR IGNORE INTO {table} SELECT * FROM {alias}.{table}")
                print(f"   [✓] {db_file} -> {table}: {master_cursor.rowcount} rows migrated.")

            # 4. Commit data BEFORE detaching
            master_cursor.execute("COMMIT")
            
            # 5. Detach safely
            master_cursor.execute(f"DETACH DATABASE {alias}")

        except Exception as e:
            master_cursor.execute("ROLLBACK") # Undo if error
            print(f"   [!] Error processing {db_file}: {e}")

    master_conn.close()

def summarize_migration():
    print("\n" + "="*30)
    print("FINAL MIGRATION SUMMARY")
    print("="*30)
    
    if not os.path.exists(MASTER_DB_PATH):
        print("Master database file not found!")
        return

    conn = sqlite3.connect(MASTER_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = [row[0] for row in cursor.fetchall()]
    
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM \"{table}\"")
        count = cursor.fetchone()[0]
        print(f"{table.ljust(20)} => {count:,} rows")
    conn.close()

if __name__ == "__main__":
    # Clean start: Delete old master if you want a fresh merge
    if os.path.exists(MASTER_DB_PATH):
        os.remove(MASTER_DB_PATH)
        
    migrate_data()
    summarize_migration()