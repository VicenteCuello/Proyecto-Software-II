import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        { email, password }
      );
      alert('Registro exitoso. Ya puedes iniciar sesión.');
      window.location.href = '/login';
    } catch (err) {
      const msg = err.response?.data?.error || 'Error de servidor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registrarse</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;
