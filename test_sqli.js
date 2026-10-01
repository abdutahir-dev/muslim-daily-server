import { deenbotDb, getDb } from './src/db/connection.js';
import * as adminController from './src/controllers/adminController.js';

async function run() {
  await getDb();
  const req = {
    query: {
      sort: 'id; SELECT 1',
      order: 'DESC'
    }
  };
  const res = {
    json: console.log,
    status: (s) => ({ json: (d) => console.log(s, d) })
  };

  const handler = adminController.listResource(deenbotDb, 'users', ['username', 'email']);
  await handler(req, res);
}
run();
