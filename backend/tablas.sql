-- Tabla usuario
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla actividades
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  temperature_range INT[2],  -- Un array con dos valores (min y max temperatura)
  weather_conditions TEXT[]  -- Un array de textos con los posibles estados climáticos
);