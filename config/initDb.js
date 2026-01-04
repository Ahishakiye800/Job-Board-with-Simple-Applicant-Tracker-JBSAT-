import pool from './database.js'; // L'extension .js est obligatoire en ESM
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// En ESM, __dirname n'existe pas par défaut, il faut le définir :
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('📡 Connected to PostgreSQL');

    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );

    await client.query(schemaSQL);
    client.release();
    
    console.log('✅ Database tables created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export default initializeDatabase;