// database.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Error al obtener conexión:', error);
    throw error; 
  }
}

module.exports = { getConnection };
