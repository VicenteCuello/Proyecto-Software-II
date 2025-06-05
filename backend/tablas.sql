-- Tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
  email VARCHAR(100) PRIMARY KEY,
  contraseña VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL
);

-- Tabla actividad
CREATE TABLE IF NOT EXISTS actividad (
  nombre VARCHAR(100) PRIMARY KEY,
  temp_min DECIMAL(5, 2) NOT NULL,
  temp_max DECIMAL(5, 2) NOT NULL,
  estado_clima JSONB NOT NULL,
  imagen VARCHAR(255) NOT NULL
);

-- Tabla intermedia para actividades favoritas
CREATE TABLE IF NOT EXISTS usuario_actividad_fav (
  email VARCHAR(100) NOT NULL,
  actividad_nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (email, actividad_nombre),
  FOREIGN KEY (email) REFERENCES usuario(email) ON DELETE CASCADE,
  FOREIGN KEY (actividad_nombre) REFERENCES actividad(nombre) ON DELETE CASCADE
);

-- Tabla evento
CREATE TABLE IF NOT EXISTS evento (
  id SERIAL PRIMARY KEY,
  usuario_email VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  fecha TIMESTAMP NOT NULL,
  actividad_nombre VARCHAR(100) NOT NULL,
  FOREIGN KEY (usuario_email) REFERENCES usuario(email) ON DELETE CASCADE,
  FOREIGN KEY (actividad_nombre) REFERENCES actividad(nombre) ON DELETE CASCADE
);
