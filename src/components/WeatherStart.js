import React, { useState, useEffect, useCallback } from 'react';
import { getWeatherByCity } from '../api/weather';

function WeatherStart() {
  const [inputCity, setInputCity] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [emoji, setEmoji] = useState('🌤️');
  const [boxColor, setBoxColor] = useState('white');
  const [submitted, setSubmitted] = useState(false);

  const traducirMainClima = (main) => {
    const traducciones = {
      Thunderstorm: 'tormenta',
      Drizzle: 'lluvia',
      Rain: 'lluvia',
      Snow: 'nieve',
      Clear: 'soleado',
      Clouds: 'nublado',
      Mist: 'niebla',
      Smoke: 'niebla',
      Haze: 'niebla',
      Dust: 'niebla',
      Fog: 'niebla',
      Sand: 'niebla',
      Ash: 'niebla',
      Squall: 'viento',
      Tornado: 'tormenta'
    };
    return traducciones[main] || main.toLowerCase();
  };

  const getEmoji = (weather) => {
    const w = weather.toLowerCase();
    if (w.includes('sol')) return '☀️';
    if (w.includes('lluvia')) return '🌧️';
    if (w.includes('nublado')) return '☁️';
    if (w.includes('tormenta')) return '⛈️';
    if (w.includes('nieve')) return '❄️';
    if (w.includes('viento')) return '🌬️';
    if (w.includes('niebla')) return '🌫️';
    return '🌤️';
  };

  const getBoxColor = (weather) => {
    const w = weather.toLowerCase();
    if (w.includes('sol')) return 'yellow';
    if (w.includes('lluvia')) return 'lightblue';
    if (w.includes('nublado') || w.includes('tormenta') || w.includes('viento') || w.includes('nieve')) return 'gray';
    return 'white';
  };

  // Versión estable con useCallback
  const obtenerClimaPorCiudad = useCallback(async (nombreCiudad) => {
    try {
      const data = await getWeatherByCity(nombreCiudad);
      const climaTraducido = traducirMainClima(data.weather[0].main);
      setCiudad(data.name);
      setWeather(climaTraducido);
      setTemperature(data.main.temp.toFixed(1));
      setEmoji(getEmoji(climaTraducido));
      setBoxColor(getBoxColor(climaTraducido));
      setSubmitted(true);
    } catch (error) {
      alert('No se pudo obtener el clima para esa ciudad.');
      setSubmitted(false);
    }
  }, []);

  // Mostrar clima de Concepción por defecto
  useEffect(() => {
    obtenerClimaPorCiudad('Concepción');
  }, [obtenerClimaPorCiudad]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim() !== '') {
      obtenerClimaPorCiudad(inputCity.trim());
      setInputCity('');
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", width: "300px", backgroundColor: "#78baff", margin: "16px auto", fontFamily: "'Quicksand', sans-serif" }}>
      <h2 style={{ margin: "16px" }}>Clima</h2>
      <form onSubmit={handleSubmit} style={{ margin: "0 16px 16px 16px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Ingresa la ciudad:</label>
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Ej: Madrid"
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", marginTop: "5px" }}>Mostrar clima</button>
      </form>

      {submitted && (
        <div style={{ margin: "8px 16px", border: "1px solid #4CAF50", borderRadius: "8px", backgroundColor: boxColor, textAlign: "center" }}>
          <h3>Clima de Hoy en {ciudad}</h3>
          <p style={{ fontSize: "2rem" }}>{emoji}</p>
          <p>{weather}</p>
          <p>🌡️ {temperature} °C</p>
        </div>
      )}
    </div>
  );
}

export default WeatherStart;
