import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, 'db');
const outputSqlFile = path.join(__dirname, 'migration_dump.sql');

const dbs = [
    'deenbot.sqlite',
    'prayers.sqlite',
    'quotes.sqlite',
    'quran.sqlite'
];

async function migrate() {
    const stream = fs.createWriteStream(outputSqlFile);
    
    const write = (data) => new Promise(resolve => {
        if (!stream.write(data)) {
            stream.once('drain', resolve);
        } else {
            process.nextTick(resolve);
        }
    });

    await write(`-- MySQL Migration Dump\n`);
    await write(`SET FOREIGN_KEY_CHECKS = 0;\n`);
    await write(`SET NAMES utf8mb4;\n\n`);

    for (const dbName of dbs) {
        console.log(`Processing ${dbName}...`);
        const dbPath = path.join(dbDir, dbName);
        if (!fs.existsSync(dbPath)) {
            console.warn(`Database ${dbName} not found at ${dbPath}`);
            continue;
        }

        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'android_metadata'");

        for (const table of tables) {
            const tableName = table.name;
            console.log(`  Table: ${tableName}`);

            const columns = await db.all(`PRAGMA table_info(\`${tableName}\`)`);
            const pks = columns.filter(c => c.pk > 0).sort((a, b) => a.pk - b.pk);
            
            await write(`-- Table structure for ${tableName} (${dbName})\n`);
            await write(`DROP TABLE IF EXISTS \`${tableName}\`;\n`);
            await write(`CREATE TABLE \`${tableName}\` (\n`);

            const colDefs = columns.map(col => {
                let type = col.type.toUpperCase();
                if (type === 'INTEGER' && col.pk) type = 'INT';
                else if (type === 'INTEGER') type = 'INT';
                else if (type === 'TEXT') type = 'LONGTEXT';
                else if (type.includes('VARCHAR')) type = 'VARCHAR(255)';
                else if (type === '') type = 'LONGTEXT';

                let extra = '';
                if (col.notnull) extra += ' NOT NULL';
                if (col.pk && pks.length === 1 && (type === 'INT' || type === 'INTEGER')) extra += ' AUTO_INCREMENT';
                if (col.dflt_value !== null) extra += ` DEFAULT ${col.dflt_value}`;

                return `  \`${col.name}\` ${type}${extra}`;
            });

            if (pks.length > 0) {
                colDefs.push(`  PRIMARY KEY (${pks.map(p => `\`${p.name}\``).join(', ')})`);
            }

            await write(colDefs.join(',\n') + `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`);

            const countRow = await db.get(`SELECT COUNT(*) as count FROM \`${tableName}\``);
            const totalRows = countRow.count;
            console.log(`    Exporting ${totalRows} rows...`);

            const chunkSize = 500;
            for (let offset = 0; offset < totalRows; offset += chunkSize) {
                const rows = await db.all(`SELECT * FROM \`${tableName}\` LIMIT ${chunkSize} OFFSET ${offset}`);
                if (rows.length === 0) break;

                const columnNames = Object.keys(rows[0]);
                await write(`INSERT INTO \`${tableName}\` (\`${columnNames.join('`, `')}\`) VALUES\n`);
                
                const valueSets = rows.map(row => {
                    const values = columnNames.map(col => {
                        const val = row[col];
                        if (val === null) return 'NULL';
                        if (typeof val === 'string') {
                            // Basic escaping for MySQL
                            return `'${val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
                        }
                        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
                        return val;
                    });
                    return `(${values.join(', ')})`;
                });

                await write(valueSets.join(',\n') + ';\n');
                if (offset % 5000 === 0 && offset > 0) console.log(`      ... ${offset} rows done`);
            }
            await write(`\n`);
        }
        await db.close();
    }

    await write(`SET FOREIGN_KEY_CHECKS = 1;\n`);
    stream.end();
    console.log(`Migration script generated: ${outputSqlFile}`);
}

migrate().catch(console.error);
