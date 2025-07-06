import React, { useState, useEffect } from 'react';
import { getWeatherByCity, getForecastByCity } from '../api/weather';
import { getActividadesFavoritas } from '../api/actividades'; // Importación nueva

function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const data = await getActividadesFavoritas();
        setActividades(data);
      } catch (err) {
        console.error('Error al cargar actividades', err);
      }
    };
    fetchActividades();
  }, []);

  const handleSearch = async () => {
    try {
      const actual = await getWeatherByCity(city);
      const pronostico = await getForecastByCity(city);
      setWeather(actual);
      setForecast(pronostico.list);
    } catch (error) {
      alert('No se pudo obtener el clima.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const calcularResumenDelDia = (bloques) => {
    const tempPromedio =
      bloques.reduce((sum, b) => sum + b.main.temp, 0) / bloques.length;

    const estados = bloques.reduce((acc, b) => {
      const estado = b.weather[0].main;
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});
    const estadoDominante = Object.entries(estados).sort((a, b) => b[1] - a[1])[0][0];

    return {
      tempPromedio: tempPromedio.toFixed(1),
      estado: estadoDominante,
    };
  };

  const esActividadRecomendada = (actividad, clima) => {
    if (!clima) return false;
    const estado = clima.weather[0].main.toLowerCase();

    switch (actividad.clave) {
      case 'correr':
        return estado !== 'rain' && estado !== 'storm';
      case 'leer':
        return estado !== 'rain';
      case 'playa':
        return estado === 'clear';
      case 'pelicula':
        return true;
      default:
        return false;
    }
  };

  const ahora = new Date();
  const bloquesFuturos = forecast.filter((item) => new Date(item.dt_txt) > ahora);
  const forecastByDay = bloquesFuturos.reduce((acc, item) => {
    const fecha = item.dt_txt.split(' ')[0];
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(item);
    return acc;
  }, {});

  return (
    <div style={{ padding: 20 }}>
      <h1>Consulta el Clima</h1>
      <input
        type="text"
        placeholder="Escribe una ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSearch}>Buscar</button>

      {weather && (
        <div style={{ marginTop: 20 }}>
          <h2>Ahora en {weather.name}</h2>
          <p>Temperatura: {weather.main.temp}°C</p>
          <p>Clima: {weather.weather[0].description}</p>
          <p>Humedad: {weather.main.humidity}%</p>
          <p>Viento: {weather.wind.speed} m/s</p>

          <h3 style={{ marginTop: 20 }}>Actividades recomendadas hoy</h3>
          <ul>
            {actividades.length === 0 && <li>No hay actividades favoritas guardadas.</li>}
            {actividades.map((actividad) => {
              const recomendada = esActividadRecomendada(actividad, weather);
              return (
                <li key={actividad.id} style={{ color: recomendada ? 'green' : 'gray' }}>
                  {actividad.nombre} {recomendada ? '✅' : '❌'}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Próximos bloques de 3h</h3>
          {bloquesFuturos.slice(0, 8).map((item, i) => (
            <div key={i}>
              {new Date(item.dt_txt).toLocaleString(undefined, {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })} - {item.main.temp}°C, {item.weather[0].description}
            </div>
          ))}

          <h3>Resumen de los próximos días</h3>
          {Object.entries(forecastByDay).map(([fecha, bloques]) => {
            const resumen = calcularResumenDelDia(bloques);
            return (
              <div key={fecha}>
                <strong>{fecha}</strong>: {resumen.tempPromedio}°C, {resumen.estado}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WeatherPage;