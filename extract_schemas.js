import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, 'db');

const dbs = [
    'deenbot.sqlite',
    'prayers.sqlite',
    'quotes.sqlite',
    'quran.sqlite'
];

async function getSchemas() {
    for (const dbName of dbs) {
        console.log(`--- Schema for ${dbName} ---`);
        const db = await open({
            filename: path.join(dbDir, dbName),
            driver: sqlite3.Database
        });

        const tables = await db.all("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        for (const table of tables) {
            console.log(`Table: ${table.name}`);
            console.log(table.sql);
            
            // Get columns info for more detail
            const columns = await db.all(`PRAGMA table_info(${table.name})`);
            console.log('Columns:', JSON.stringify(columns, null, 2));
            console.log('');
        }
        await db.close();
    }
}

getSchemas().catch(console.error);
