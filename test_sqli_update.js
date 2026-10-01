import { deenbotDb, getDb } from './src/db/connection.js';
import * as adminController from './src/controllers/adminController.js';

async function run() {
  await getDb();

  const req = {
    body: {
      "username": "test1",
      "email = ?; SELECT 1; --": "test2"
    },
    params: {
        id: 1
    }
  };
  const res = {
    json: console.log,
    status: (s) => ({ json: (d) => console.log(s, d) })
  };

  const handler = adminController.updateResource(deenbotDb, 'users', ['username', 'email', 'email = ?; SELECT 1; --']);
  await handler(req, res);
}
run();
