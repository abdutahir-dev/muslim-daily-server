import re

with open('src/db/connection.js', 'r') as f:
    content = f.read()

new_content = content.replace('''        try {
            const rows = await prisma.$queryRawUnsafe(sql, ...(params || []));
            if (rows && rows.length > 0) {
                 for (const row of rows) {
                     for (let key in row) {
                         if (typeof row[key] === 'bigint') {
                             row[key] = Number(row[key]);
                         }
                     }
                 }
            }
            return rows[0];
        } catch (e) {''', '''        try {
            const rows = await prisma.$queryRawUnsafe(sql, ...(params || []));
            if (rows && rows.length > 0) {
                 for (const row of rows) {
                     for (let key in row) {
                         if (typeof row[key] === 'bigint') {
                             row[key] = Number(row[key]);
                         }
                     }
                 }
            }
            return rows ? rows[0] : null;
        } catch (e) {''').replace('''        try {
            return await prisma.$queryRawUnsafe(sql, ...(params || []));
        } catch (e) {''', '''        try {
            const rows = await prisma.$queryRawUnsafe(sql, ...(params || []));
            if (rows && rows.length > 0) {
                 for (const row of rows) {
                     for (let key in row) {
                         if (typeof row[key] === 'bigint') {
                             row[key] = Number(row[key]);
                         }
                     }
                 }
            }
            return rows;
        } catch (e) {''')

with open('src/db/connection.js', 'w') as f:
    f.write(new_content)
