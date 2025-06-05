const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));  // Sirve todo el contenido estático dentro de 'public'

// Rutas básicas para responder a solicitudes GET
app.get('/', (req, res) => {
  res.send('¡Servidor de Node.js en ejecución!');
});

// Rutas adicionales y lógica de la aplicación
app.post('/eventos', async (req, res) => {
  // Lógica para agregar eventos
});

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'weatherApp',
  password: 'software.grupo3',
  port: 5432,
});

// Agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
  const { email, contraseña, nombre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuario (email, contraseña, nombre) VALUES ($1, $2, $3) RETURNING *',
      [email, contraseña, nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
});

// Obtener todas las actividades
app.get('/actividades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM actividad');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

// Asignar actividad favorita a usuario
app.post('/usuarios/:email/actividades-fav', async (req, res) => {
  const { email } = req.params;
  const { actividad_nombre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuario_actividad_fav (email, actividad_nombre) VALUES ($1, $2) RETURNING *',
      [email, actividad_nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al asignar actividad favorita:', error);
    res.status(500).json({ error: 'Error al asignar actividad favorita' });
  }
});

// Eliminar la actividad favorita de un usuario
app.delete('/usuarios/:email/actividades-fav/:actividad_nombre', async (req, res) => {
  const { email, actividad_nombre } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM usuario_actividad_fav WHERE email = $1 AND actividad_nombre = $2 RETURNING *',
      [email, actividad_nombre]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Actividad favorita no encontrada para este usuario' });
    }
    res.json({ message: 'Actividad favorita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar actividad favorita:', error);
    res.status(500).json({ error: 'Error al eliminar actividad favorita' });
  }
});

// Obtener actividades favoritas de un usuario
app.get('/usuarios/:email/actividades-fav', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.*
       FROM actividad a
       JOIN usuario_actividad_fav uaf ON a.nombre = uaf.actividad_nombre
       WHERE uaf.email = $1`,
      [email]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener actividades favoritas:', error);
    res.status(500).json({ error: 'Error al obtener actividades favoritas' });
  }
});

// Crear un evento
app.post('/eventos', async (req, res) => {
  const { usuario_email, actividad_nombre, ubicacion, fecha } = req.body;
  
  if (!usuario_email || !actividad_nombre || !ubicacion || !fecha) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO evento (usuario_email, ubicacion, fecha, actividad_nombre) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario_email, ubicacion, fecha, actividad_nombre]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
});


// Eliminar un evento por ID
app.delete('/eventos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM evento WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});

