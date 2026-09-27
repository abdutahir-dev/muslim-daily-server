import re

with open('src/db/connection.js', 'r') as f:
    content = f.read()

new_content = content.replace('''class PrismaWrapper {
    constructor() {}

    async get(sql, params) {
        try {
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
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    async all(sql, params) {
        try {
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
        } catch (e) {
            console.error(e)
            return [];
        }
    }

    async run(sql, params) {
        try {
            const res = await prisma.$executeRawUnsafe(sql, ...(params || []));
            return { changes: res };
        } catch(e) {
             console.error(e)
             return { changes: 0 }
        }
    }

    async exec(sql) {
        try {
            await prisma.$executeRawUnsafe(sql);
            return Promise.resolve();
        } catch (e) {
            console.error(e)
            return Promise.resolve();
        }
    }
}''', '''class PrismaWrapper {
    constructor() {}

    normalizeParams(params) {
        if (!params) return [];
        if (Array.isArray(params)) return params;
        if (typeof params === 'object') return params;
        return [params];
    }

    async get(sql, ...args) {
        const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        const normalized = this.normalizeParams(params);
        try {
            const rows = await prisma.$queryRawUnsafe(sql, ...normalized);
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
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    async all(sql, ...args) {
        const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        const normalized = this.normalizeParams(params);
        try {
            const rows = await prisma.$queryRawUnsafe(sql, ...normalized);
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
        } catch (e) {
            console.error(e)
            return [];
        }
    }

    async run(sql, ...args) {
        const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        const normalized = this.normalizeParams(params);
        try {
            const res = await prisma.$executeRawUnsafe(sql, ...normalized);
            let lastID = null;
            try {
                const rows = await prisma.$queryRawUnsafe('SELECT last_insert_rowid() AS id');
                if (rows && rows.length > 0 && rows[0].id) {
                    lastID = typeof rows[0].id === 'bigint' ? Number(rows[0].id) : rows[0].id;
                }
            } catch (e) {}
            return { changes: res, lastID: lastID, lastInsertRowid: lastID };
        } catch(e) {
             console.error(e)
             return { changes: 0, lastID: null, lastInsertRowid: null }
        }
    }

    async exec(sql) {
        try {
            await prisma.$executeRawUnsafe(sql);
            return Promise.resolve();
        } catch (e) {
            console.error(e)
            return Promise.resolve();
        }
    }

    prepare(sql) {
        const self = this;
        return {
            run: (...params) => self.run(sql, ...params),
            get: (...params) => self.get(sql, ...params),
            all: (...params) => self.all(sql, ...params),
            finalize: () => Promise.resolve(),
        };
    }
}''')

with open('src/db/connection.js', 'w') as f:
    f.write(new_content)
