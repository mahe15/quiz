const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quizbattle',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection()
  .then((conn) => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    console.log('⚠️  Server will continue without database — Socket.IO features still work');
  });

module.exports = pool;
