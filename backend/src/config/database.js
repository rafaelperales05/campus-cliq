import knex from 'knex';
import dotenv from 'dotenv';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url'; // Helper for ES Modules

dotenv.config();

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    // Use path.resolve to create an absolute path
    directory: path.resolve(__dirname, '../migrations'),
  },
  seeds: {
    // Use path.resolve to create an absolute path
    directory: path.resolve(__dirname, '../seeds'),
  },
};

const db = knex(config);

export default db;