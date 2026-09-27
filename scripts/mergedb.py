import sqlite3
import os
import re

SOURCE_DIR = './db'
MASTER_DB_PATH = './muslimdaily_master.sqlite'

def get_columns(cursor, alias, table_name):
    """Retrieves columns safely."""
    cursor.execute(f"PRAGMA {alias}.table_info(\"{table_name}\")")
    return cursor.fetchall()

def migrate_data():
    master_conn = sqlite3.connect(MASTER_DB_PATH, timeout=60, uri=True)
    master_conn.isolation_level = None
    master_cursor = master_conn.cursor()

    db_files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(('.sqlite', '.db'))]
    db_files = [f for f in db_files if f not in MASTER_DB_PATH]

    print(f"Starting migration of {len(db_files)} databases...")

    for db_file in db_files:
        db_path = os.path.abspath(os.path.join(SOURCE_DIR, db_file))
        alias = "src_" + re.sub(r'[^a-zA-Z0-9]', '_', os.path.splitext(db_file)[0])
        
        try:
            master_cursor.execute(f"ATTACH DATABASE 'file:{db_path}?mode=ro' AS {alias}")
            master_cursor.execute(f"SELECT name, sql FROM {alias}.sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
            tables = master_cursor.fetchall()

            master_cursor.execute("BEGIN TRANSACTION")

            for table_name, table_sql in tables:
                
                # Check if table already exists in master db
                master_cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
                exists = master_cursor.fetchone()
                
                if not exists:
                     master_cursor.execute(table_sql) # Create table with original schema
                
                master_cursor.execute(f"INSERT OR IGNORE INTO {table_name} SELECT * FROM {alias}.{table_name}")
                print(f"   [✓] {db_file} -> {table_name}: {master_cursor.rowcount} rows migrated.")

            master_cursor.execute("COMMIT")
            master_cursor.execute(f"DETACH DATABASE {alias}")

        except Exception as e:
            master_cursor.execute("ROLLBACK")
            print(f"   [!] Error processing {db_file}: {e}")

    master_conn.close()

if __name__ == "__main__":
    if os.path.exists(MASTER_DB_PATH):
        os.remove(MASTER_DB_PATH)
    migrate_data()
