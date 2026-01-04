import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const initializeDatabase = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database initialized");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

export default initializeDatabase;
