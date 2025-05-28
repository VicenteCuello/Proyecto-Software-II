import React, { useState } from 'react';
import { getWeatherByCoords } from '../api/weather';

export default function WeatherCurrentLocation() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada en este navegador');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await getWeatherByCoords(latitude, longitude);
          setWeather(data);
        } catch (err) {
          setError('No se pudo obtener el clima');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Permiso denegado o error obteniendo la ubicación');
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <button onClick={fetchWeatherByLocation}>Obtener clima ubicación actual</button>

      {loading && <p>Cargando...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div>
          <h3>{weather.name}</h3>
          <p>Temperatura: {weather.main.temp} °C</p>
          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
