// index.js
const express = require('express');
const { getConnection } = require('./src/database');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Cargar variables de entorno

const app = express();
const port = 3000;

// Middleware para parsear el body de las solicitudes POST
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.post('/consulta', async (req, res) => {
  const { actor, fecha, hora } = req.body;
  let query = 'SELECT * FROM sakila.actor WHERE 1=1';
  const params = [];

  if (actor) {
    query += ' AND (first_name = ? OR last_name = ?)';
    params.push(actor, actor);
  }

  if (fecha && hora) {
    const datetime = `${fecha} ${hora}`;
    query += ' AND last_update = ?';
    params.push(datetime);
  } else if (fecha) {
    query += ' AND DATE(last_update) = ?';
    params.push(fecha);
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.query(query, params);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error ejecutando query', error);
    res.status(500).send('Error al realizar la consulta');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
