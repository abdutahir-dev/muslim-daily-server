import sqlite3
import sys
path='data/azkar-db'
conn=sqlite3.connect(path)
c=conn.cursor()
print('tables:')
for row in c.execute("select name from sqlite_master where type='table'"):
    print(row)
for t in ['category','azkar']:
    print('\nTable',t)
    for row in c.execute(f"PRAGMA table_info({t})"):
        print(row)
    print('sample:')
    for row in c.execute(f"select * from {t} limit 5"):
        print(row)
conn.close()