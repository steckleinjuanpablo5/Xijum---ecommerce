import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

async function start() {
  try {
    await pool.query('SELECT NOW()');
    app.listen(env.port, () => {
      console.log(`✅ API lista en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('❌ No fue posible iniciar la API:', error.message);
    process.exit(1);
  }
}

start();
