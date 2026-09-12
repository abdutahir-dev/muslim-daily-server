import sqlite3
path='db/dua.sqlite'
conn=sqlite3.connect(path)
c=conn.cursor()
for row in c.execute("select name from sqlite_master where type='table'"):
    print(row)

for t in ['categories','duas']:
    print('\nTable',t)
    for row in c.execute(f"PRAGMA table_info({t})"):
        print(row)
    print('sample:')
    for row in c.execute(f"select * from {t} limit 3"):
        print(row)
    if t == 'categories':
        print('\nCategories with id >= 120:')
        for row in c.execute('select id,name_en,name_ar from categories where id>=120'):
            print(row)
# show counts by category for duas
if True:
    print('\nCounts by category:')
    for row in c.execute('select category_id, count(*) from duas group by category_id'):
        print(row)
conn.close()