const pool = require('./database');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  try {
    // Vérification de la connexion avant de lancer le SQL
    const client = await pool.connect();
    console.log('📡 Connected to PostgreSQL successfully');

    console.log('📦 Initializing database tables...');
    
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );

    await client.query(schemaSQL);
    client.release(); // Libère le client après exécution
    
    console.log('✅ Database tables created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    // Sur Render, on ne veut pas forcément crash tout le serveur si les tables existent déjà
    // mais ici on throw pour voir l'erreur dans les logs
    throw error;
  }
};

module.exports = initializeDatabase;