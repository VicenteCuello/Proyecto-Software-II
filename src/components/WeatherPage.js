// src/pages/WeatherPage.js
// src/pages/WeatherPage.js
import React, { useState } from 'react';
import { getWeatherByCity, getForecastByCity } from '../api/weather';

function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

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

  // Obtener los bloques a partir de ahora
  const ahora = new Date();
  const bloquesFuturos = forecast.filter((item) => new Date(item.dt_txt) > ahora);

  // Agrupar bloques por fecha
  const forecastByDay = bloquesFuturos.reduce((acc, item) => {
    const fecha = item.dt_txt.split(' ')[0];
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(item);
    return acc;
  }, {});

  const hoy = new Date().toISOString().split('T')[0];

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

/*import React, { useState } from 'react';
import { getWeatherByCity, getForecastByCity } from '../api/weather';

function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

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

  const hoy = new Date().toISOString().split('T')[0];

  const forecastByDay = forecast.reduce((acc, item) => {
    const fecha = item.dt_txt.split(' ')[0];
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(item);
    return acc;
  }, {});

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
        </div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Hoy por bloques de 3h</h3>
          {forecastByDay[hoy]?.map((item, i) => (
            <div key={i}>
              {item.dt_txt.split(' ')[1]} - {item.main.temp}°C, {item.weather[0].description}
            </div>
          ))}

          <h3>Próximos días</h3>
          {Object.entries(forecastByDay).map(([fecha, bloques]) => {
            if (fecha === hoy) return null;
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
*/

/*import React, { useState } from 'react';
import { getWeatherByCity } from '../api/weather'; // Asegúrate de importar correctamente getWeatherByCity

function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await getWeatherByCity(city); // Usar la función correctamente
      setWeather(data);
    } catch (error) {
      alert('No se pudo obtener el clima.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
          <h2>{weather.name}</h2>
          <p>Temperatura: {weather.main.temp}°C</p>
          <p>Clima: {weather.weather[0].main}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherPage;*/

