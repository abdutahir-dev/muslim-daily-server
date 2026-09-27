import re

with open('src/db/connection.js', 'r') as f:
    content = f.read()

# Replace all the individual db instances with a prisma client
new_content = """import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const getDb = async () => {
    return prisma;
};

// Backwards compatibility layer
class PrismaWrapper {
    constructor() {}

    async get(sql, params) {
        try {
            const rows = await prisma.$queryRawUnsafe(sql, ...(params || []));
            return rows[0];
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    async all(sql, params) {
        try {
            return await prisma.$queryRawUnsafe(sql, ...(params || []));
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
}

const dbWrapper = new PrismaWrapper();

export const quotesDb = dbWrapper;
export const deenbotDb = dbWrapper;
export const quranDb = dbWrapper;
export const prayersDb = dbWrapper;
export const duaDb = dbWrapper;
export const hadithDb = dbWrapper;
export const qamusDb = dbWrapper;
export const asmaulHusnaDb = dbWrapper;
export const dictionaryDb = dbWrapper;

export async function initDatabases() {
  return { quotesDb, deenbotDb, quranDb, prayersDb, duaDb, hadithDb, qamusDb, asmaulHusnaDb, dictionaryDb };
}
"""

with open('src/db/connection.js', 'w') as f:
    f.write(new_content)
