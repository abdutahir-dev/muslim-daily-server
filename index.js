import app from './src/app.js';
import { initDatabases } from './src/db/connection.js';

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    await initDatabases();
    app.listen(PORT, HOST, () => {
      console.log(`Muslim Daily API server running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
