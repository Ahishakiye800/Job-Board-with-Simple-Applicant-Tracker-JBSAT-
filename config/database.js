
// const { Pool } = require('pg');
// require('dotenv').config();

// console.log('🔧 Database Config:');
// console.log('   Host:', process.env.DB_HOST);
// console.log('   Port:', process.env.DB_PORT);
// console.log('   User:', process.env.DB_USER);
// console.log('   Database:', process.env.DB_NAME);

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('❌ Database error:', err);
//   process.exit(-1);
// });


// config/database.js
// import pkg from 'pg';
// const { Pool } = pkg;

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// // Create the named export that server.js is looking for
// export const initializeDatabase = async () => {
//   const client = await pool.connect();
//   try {
//     const res = await client.query('SELECT NOW()');
//     console.log('✅ Postgres Connected:', res.rows[0].now);
//   } finally {
//     client.release();
//   }
// };


import pg from 'pg'; // In ESM, we import the whole package
const { Pool } = pg;
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render/External DBs
  }
});

export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Successfully connected to PostgreSQL");
    client.release();
  } catch (err) {
    console.error("❌ Database connection error:", err.stack);
    throw err;
  }
};
// THIS IS THE FIX:
export default pool;