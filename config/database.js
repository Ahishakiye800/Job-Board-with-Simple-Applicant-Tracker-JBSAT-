
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

// module.exports = pool;
const { Pool } = require('pg');

// Cette configuration est la SEULE qui marche sur Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Lit l'URL complète
  ssl: {
    rejectUnauthorized: false // OBLIGATOIRE pour Render
  }
});

// Petit test de log pour debug
console.log('Attempting to connect to database via URL:', process.env.DATABASE_URL ? 'URL is set' : 'URL is MISSING');

module.exports = pool;