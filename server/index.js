const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const pool    = require('./db');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

const JWT_SECRET  = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// → Ruta de registro
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Hashear contraseña
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // 2) Insertar usuario
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hash]
    );
    const user = result.rows[0];
    // 3) Devolver usuario sin password
    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    // 4) Si es violación de UNIQUE, enviar 400
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Ese email ya está registrado.' });
    }
    res.status(500).json({ error: 'Error de servidor.' });
  }
});

// → Ruta de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Buscar usuario
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    const user = result.rows[0];
    // 2) Comparar hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    // 3) Generar y devolver JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor.' });
  }
});

// → Middleware de autenticación
function authenticateToken(req, res, next) {
  console.log('>> Authorization header:', req.headers['authorization']);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('⛔ No token recibido');
    return res.sendStatus(401);
  }
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.log('⛔ Token inválido o expirado:', err.message);
      return res.sendStatus(403);
    }
    req.user = payload; 
    next();
  });
}

// → Ruta protegida de ejemplo
app.get('/api/profile', authenticateToken, async (req, res) => {
  const { id } = req.user;
  const result = await pool.query(
    'SELECT id, email, created_at FROM users WHERE id = $1',
    [id]
  );
  res.json({ profile: result.rows[0] });
});

// → Obtener todas las actividades disponibles, no solo las favoritas
app.get('/api/activities', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, image, temperature_range, weather_conditions FROM activities ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar actividades.' });
  }
});

// → Obtener lista de IDs de actividades favoritas del usuario
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT activity_id FROM user_favorites WHERE user_id = $1',
      [userId]
    );
    // Devolvemos un array de números
    res.json(result.rows.map(r => r.activity_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar favoritas.' });
  }
});

// Obtener actividades favoritas con nombre e imagen
app.get('/api/favorites/details', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT a.id, a.name, a.image
       FROM activities a
       JOIN user_favorites uf ON uf.activity_id = a.id
       WHERE uf.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar detalles de favoritas.' });
  }
});


// → Marcar una actividad como favorita
app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId } = req.body;
    await pool.query(
      `INSERT INTO user_favorites(user_id, activity_id)
       VALUES($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, activityId]
    );
    res.status(201).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar favorita.' });
  }
});

// → Quitar una actividad de favoritas
app.delete('/api/favorites/:activityId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId } = req.params;
    await pool.query(
      'DELETE FROM user_favorites WHERE user_id = $1 AND activity_id = $2',
      [userId, activityId]
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar favorita.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

