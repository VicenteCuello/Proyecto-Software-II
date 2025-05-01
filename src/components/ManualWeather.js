import React, { useState } from 'react';

function ManualWeather() {
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emoji, setEmoji] = useState('🌤️'); // Valor por defecto
  const [boxColor, setBoxColor] = useState('white'); // Color inicial del cuadro

  const handleSubmit = (e) => {
    e.preventDefault();
    const emojiResult = getEmoji(weather); // Buscar emoji basado en clima
    setEmoji(emojiResult);
    setBoxColor(getBoxColor(weather)); // Cambiar color del cuadro según el clima
    setSubmitted(true);
  };

  // Función que asigna un emoji según el texto ingresado
  const getEmoji = (weather) => {
    const w = weather.toLowerCase();
    if (w.includes('sol') || w.includes('soleado')) return '☀️';
    if (w.includes('lluvia') || w.includes('lluvioso')) return '🌧️';
    if (w.includes('nublado')) return '☁️';
    if (w.includes('tormenta')) return '⛈️';
    if (w.includes('nieve')) return '❄️';
    if (w.includes('viento') || w.includes('ventoso')) return '🌬️';
    if (w.includes('niebla')) return '🌫️';
    return '🌤️'; // Emoji por defecto (parcialmente soleado)
  };

  // Función que asigna un color de cuadro según el clima
  const getBoxColor = (weather) => {
    const w = weather.toLowerCase();
    if (w.includes('sol') || w.includes('soleado')) return 'yellow';
    if (w.includes('lluvia') || w.includes('lluvioso')) return 'lightblue';
    if (w.includes('nublado') || w.includes('tormenta') || w.includes('viento') || w.includes('nieve')) return 'gray';
    return 'white'; // Cuadro blanco por defecto
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", width: "300px", margin: "auto" }}>
      <h2>Ingresa el clima de hoy</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Clima:</label><br />
          <input
            type="text"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="Ej: Soleado, Lluvioso, Nublado, Tormenta..."
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <small style={{ display: "block", marginTop: "5px", fontStyle: "italic", color: "#555" }}>
            (Ejemplos: Soleado, Lluvioso, Nublado, Tormenta, Nieve, Viento, Niebla)
          </small>
        </div>
        <div>
          <label>Temperatura (°C):</label><br />
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="Ej: 23"
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%" }}>Mostrar clima</button>
      </form>

      {submitted && (
        <div 
          style={{
            marginTop: "20px",
            padding: "1rem",
            border: "1px solid #4CAF50",
            borderRadius: "8px",
            backgroundColor: boxColor,
            textAlign: "center"
          }}
        >
          <h3>Clima de Hoy:</h3>
          <p style={{ fontSize: "4rem" }}>{emoji}</p>
          <p>{weather}</p>
          <p>🌡️ {temperature} °C</p>
        </div>
      )}
    </div>
  );
}

export default ManualWeather;