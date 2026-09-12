import { writeFileSync, readFile } from "fs";
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

console.log("DB URI: ", path.join(rootDir, 'db', 'muslimdaily.sqlite'))

let duaDB = await open({
    filename: path.join(rootDir, 'db', 'muslimdaily.sqlite'),
    driver: sqlite3.Database
});

/*readFile(path.join(rootDir, 'data/dua-dhikr/daily-dua', 'en.json'), (err, content) => {
    const dailDua = JSON.parse(content.toString());
    //console.log("Daily Dua: ", dailDua);

    for (const dd of dailDua) {
        let statement = `INSERT INTO azkar(title,arabic,latin,translation,notes,fewaid,source,category_id) 
            VALUES(?,?,?,?,?,?,?,1);`;
        duaDB.run(statement, [`'${dd.title}'`, `'${dd.arabic}'`, `'${dd.latin}'`, `'${dd.translation}'`, `'${dd.notes}'`, `'${dd.benefits}'`, `'${dd.source}'`]).then(() => {
            console.log(dd.title, " - Inserted");
        });
    }

});

*/
console.log("Inserting Category 2");
readFile(path.join(rootDir, 'data/dua-dhikr/dhikr-after-salah', 'en.json'), (err, content) => {
    const dailDua = JSON.parse(content.toString());
    //console.log("Daily Dua: ", dailDua);

    for (const dd of dailDua) {
        let statement = `INSERT INTO azkar(title,arabic,latin,translation,notes,fewaid,source,category_id) 
            VALUES(?,?,?,?,?,?,?,2);`;
        duaDB.run(statement, [`'${dd.title}'`, `'${dd.arabic}'`, `'${dd.latin}'`, `'${dd.translation}'`, `'${dd.notes}'`, `'${dd.benefits}'`, `'${dd.source}'`]).then(() => {
            console.log(dd.title, " - Inserted");
        });
    }
});

console.log("Inserting Category 3");
readFile(path.join(rootDir, 'data/dua-dhikr/evening-dhikr', 'en.json'), (err, content) => {
    const dailDua = JSON.parse(content.toString());
    //console.log("Daily Dua: ", dailDua);

    for (const dd of dailDua) {
        let statement = `INSERT INTO azkar(title,arabic,latin,translation,notes,fewaid,source,category_id) 
            VALUES(?,?,?,?,?,?,?,3);`;
        duaDB.run(statement, [`'${dd.title}'`, `'${dd.arabic}'`, `'${dd.latin}'`, `'${dd.translation}'`, `'${dd.notes}'`, `'${dd.benefits}'`, `'${dd.source}'`]).then(() => {
            console.log(dd.title, " - Inserted");
        });
    }
});

console.log("Inserting Category 4");
readFile(path.join(rootDir, 'data/dua-dhikr/morning-dhikr', 'en.json'), (err, content) => {
    const dailDua = JSON.parse(content.toString());
    //console.log("Daily Dua: ", dailDua);

    for (const dd of dailDua) {
        let statement = `INSERT INTO azkar(title,arabic,latin,translation,notes,fewaid,source,category_id) 
            VALUES(?,?,?,?,?,?,?,4);`;
        duaDB.run(statement, [`'${dd.title}'`, `'${dd.arabic}'`, `'${dd.latin}'`, `'${dd.translation}'`, `'${dd.notes}'`, `'${dd.benefits}'`, `'${dd.source}'`]).then(() => {
            console.log(dd.title, " - Inserted");
        });
    }
});

console.log("Inserting Category 5");
readFile(path.join(rootDir, 'data/dua-dhikr/selected-dua', 'en.json'), (err, content) => {
    const dailDua = JSON.parse(content.toString());
    //console.log("Daily Dua: ", dailDua);

    for (const dd of dailDua) {
        let statement = `INSERT INTO azkar(title,arabic,latin,translation,notes,fewaid,source,category_id) 
            VALUES(?,?,?,?,?,?,?,5);`;
        duaDB.run(statement, [`'${dd.title}'`, `'${dd.arabic}'`, `'${dd.latin}'`, `'${dd.translation}'`, `'${dd.notes}'`, `'${dd.benefits}'`, `'${dd.source}'`]).then(() => {
            console.log(dd.title, " - Inserted");
        });
    }
});