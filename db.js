 // server/db.js
const sql = require('mssql');

// SQL Server configuration
const config = {
  user: 'sa',
  password: '1234',
  server: 'ZAREENA\SQLEXPRESS',  // Update this to your SQL Server name
  database: 'TipCalculatorDB',
  options: {
    encrypt: false,               // Use true if you're on Azure
    trustServerCertificate: true  // Required for local dev
  }
};

// Function to connect to the database
const connectToDB = async () => {
  try {
    if (!sql.pool) {
      await sql.connect(config);
      console.log('✅ Connected to SQL Server');
    }
    return sql;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    throw err;
  }
};

module.exports = {
  sql,
  connectToDB
};
