
const pool = require('./database');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  try {
    console.log('📦 Initializing database tables...');
    
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );

    await pool.query(schemaSQL);
    console.log('✅ Database tables created successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

module.exports = initializeDatabase;
