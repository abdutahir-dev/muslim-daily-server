import sqlite3
import sys

path = sys.argv[1]
conn = sqlite3.connect(path)
c = conn.cursor()
for row in c.execute("select name from sqlite_master where type='table'"):
    print(row[0])
conn.close()