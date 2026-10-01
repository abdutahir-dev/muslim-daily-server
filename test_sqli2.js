import { deenbotDb, getDb } from './src/db/connection.js';
import * as adminController from './src/controllers/adminController.js';

async function run() {
  await getDb();

  // To bypass allowedFields check, we need to pass data matching one of allowedFields.
  // The vulnerability is in `fields.join(',')`

  const req = {
    body: {
      "username": "test1",
      "email) VALUES (?, ?); SELECT 1; --": "test2"
    }
  };
  const res = {
    json: console.log,
    status: (s) => ({ json: (d) => console.log(s, d) })
  };

  const handler = adminController.createResource(deenbotDb, 'users', ['username', 'email', 'email) VALUES (?, ?); SELECT 1; --']);
  await handler(req, res);
}
run();
