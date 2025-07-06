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

-- Tabla de favoritos
CREATE TABLE user_favorites (
  user_id     INTEGER NOT NULL REFERENCES users(id),
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  created_at  TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, activity_id)
);

-- Tabla de actividades programadas por el usuario
CREATE TABLE user_scheduled_activities (
  user_id INTEGER REFERENCES users(id),
  activity_id INTEGER REFERENCES activities(id),
  scheduled_date DATE NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, activity_id, scheduled_date)
);
