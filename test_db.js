import { prisma, deenbotDb } from './src/db/connection.js';

async function test() {
    console.log(await deenbotDb.get('SELECT COUNT(*) FROM users'));
    console.log(await deenbotDb.get('SELECT * FROM users LIMIT 1'));
}
test()
