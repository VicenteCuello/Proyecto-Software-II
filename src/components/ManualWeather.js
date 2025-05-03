import React, { useState } from 'react';

function ManualWeather() {
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emoji, setEmoji] = useState('🌤️'); // Valor por defecto
  const [boxColor, setBoxColor] = useState('white'); // Color inicial del cuadro

  const availableActivities = [
    { name: 'Yoga', image: '/images/yoga.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla']},
    { name: 'Correr', image: '/images/correr.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'viento', 'niebla'] },
    { name: 'Leer', image: '/images/leer.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Estudiar React', image: '/images/estudiar react.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Ir al cine', image: '/images/ir al cine.webp', temperatura: [18, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir al gym', image: '/images/ir al gym.webp', temperatura: [16, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp', temperatura: [15, 23], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Cocinar', image: '/images/cocinar.webp', temperatura: [18, 23], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] }
  ];

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

  // Lógica para determinar qué actividades se pueden realizar
  const getAvailableActivities = () => {
    return availableActivities.filter((activity) => {
      // Comprobamos si la temperatura está dentro del rango permitido
      const isTemperatureValid = temperature >= activity.temperatura[0] && temperature <= activity.temperatura[1];
      // Comprobamos si el clima está dentro de los estados válidos
      const isWeatherValid = activity.estado.includes(weather.toLowerCase());
      return isTemperatureValid && isWeatherValid;
    });
  };

  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "8px", 
      width: "300px", 
      backgroundColor: "#78baff", 
      margin: "16px auto", 
      fontFamily: "'Quicksand', sans-serif" 
    }}>
      <h2 style={{ margin: "16px 16px 8px 16px" }}>Ingresa el clima de hoy</h2>
      <form onSubmit={handleSubmit} style={{ margin: "0 16px 16px 16px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginBottom: "5px", display: "block" }}>Clima:</label>
          <input
            type="text"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="Ej: Soleado, Lluvioso, Nublado, Tormenta..."
            required
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <small style={{ 
            display: "block", 
            marginTop: "5px", 
            fontStyle: "italic", 
            color: "#555"
          }}>
            (Ejemplos: Soleado, Lluvioso, Nublado, Tormenta, Nieve, Viento, Niebla)
          </small>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginBottom: "5px", display: "block" }}>Temperatura (°C):</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="Ej: 23"
            required
            style={{ width: "100%", marginBottom: "0px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", marginTop: "5px" }}>Mostrar clima</button>
      </form>
  
      {submitted && (
        <>
          <div 
            style={{
              margin: "8px 16px",
              border: "1px solid #4CAF50",
              borderRadius: "8px",
              backgroundColor: boxColor,
              textAlign: "center"
            }}
          >
            <h3 style={{ margin: "8px 0" }}>Clima de Hoy:</h3>
            <p style={{ fontSize: "2rem", margin: "8px 0" }}>{emoji}</p>
            <p style={{ margin: "8px 0" }}>{weather}</p>
            <p style={{ margin: "8px 0" }}>🌡️ {temperature} °C</p>
          </div>
  
          {/* Box para mostrar actividades realizables */}
          <div
            style={{
              margin: "8px 16px 16px 16px",
              border: "1px solid #4CAF50",
              borderRadius: "8px",
              backgroundColor: "#eaf7e1",
              textAlign: "center",
              minHeight: "200px"
            }}
          >
            <h4 style={{ margin: "8px 0" }}>Actividades realizables:</h4>
            {getAvailableActivities().length > 0 ? (
              <ul style={{ 
                listStyleType: "none", 
                margin: "8px 0",
                padding: "0",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                {getAvailableActivities().map((activity) => (
                  <li key={activity.name} style={{ 
                    fontSize: "15px",
                    margin: "2px 0",
                    width: "100%", // Para que el centrado funcione correctamente
                    textAlign: "center" // Doble garantía de centrado
                  }}>
                    {activity.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: "5px 0", width: "100%" }}>No hay actividades realizables para estas condiciones climáticas.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ManualWeather;



/*import React, { useState } from 'react';

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
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", width: "300px", backgroundColor: "#78baff", margin: "auto", fontFamily: "'Quicksand', sans-serif" }}>
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
          <small style={{ display: "block", marginTop: "5px", fontStyle: "italic", color: "#555"}}>
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

export default ManualWeather;*/