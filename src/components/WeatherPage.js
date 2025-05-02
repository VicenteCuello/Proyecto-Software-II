import React, { useState } from 'react';
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
          <p>Clima: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherPage;
