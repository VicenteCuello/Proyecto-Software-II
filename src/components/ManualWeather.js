import React, { useState } from 'react';
import { getWeatherByCity } from '../api/weather';

function ManualWeather() {
  const [inputCity, setInputCity] = useState('');
  const [inputWeather, setInputWeather] = useState('');
  const [inputTemperature, setInputTemperature] = useState('');
  const [apiCity, setApiCity] = useState('');
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emoji, setEmoji] = useState('🌤️');
  const [boxColor, setBoxColor] = useState('white');

  const availableActivities = [
    { name: 'Yoga', image: '/images/yoga.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'lluvia', 'tormenta', 'viento', 'niebla']},
    { name: 'Correr', image: '/images/correr.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'viento', 'niebla'] },
    { name: 'Leer', image: '/images/leer.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvia', 'tormenta', 'viento', 'niebla'] },
    { name: 'Estudiar React', image: '/images/estudiar react.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvia', 'tormenta', 'viento', 'niebla'] },
    { name: 'Ir al cine', image: '/images/ir al cine.webp', temperatura: [18, 22], estado: ['soleado', 'nublado', 'llulluviavioso', 'viento', 'niebla'] },
    { name: 'Ir al gym', image: '/images/ir al gym.webp', temperatura: [16, 22], estado: ['soleado', 'nublado', 'lluvia', 'viento', 'niebla'] },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp', temperatura: [15, 23], estado: ['soleado', 'nublado', 'lluvia', 'viento', 'niebla'] },
    { name: 'Cocinar', image: '/images/cocinar.webp', temperatura: [18, 23], estado: ['soleado', 'nublado', 'lluvia', 'tormenta', 'viento', 'niebla'] }
  ];

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
  
  const actividadesFiltradas = getAvailableActivities(weather, temperature);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalWeather = inputWeather;
    let finalTemp = inputTemperature;
  
    try {
      if (!inputWeather || !inputTemperature) {
        const data = await getWeatherByCity(inputCity);
        finalWeather = traducirMainClima(data.weather[0].main); // usar la función de traducción
        finalTemp = data.main.temp.toFixed(1);
        setApiCity(data.name);
      } else {
        setApiCity(''); // ← Limpia si se ingresó manualmente
      }
  
      setWeather(finalWeather);
      setTemperature(finalTemp);
      setEmoji(getEmoji(finalWeather));
      setBoxColor(getBoxColor(finalWeather));
      setSubmitted(true);
  
      // Limpiar inputs
      setInputWeather('');
      setInputTemperature('');
      setInputCity('');
    } catch (error) {
      alert('No se pudo obtener el clima para esa ciudad.');
      setSubmitted(false);
    }
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

  function getAvailableActivities(weather, temperature) {
    if (!weather || temperature === '') return [];
  
    const temp = parseFloat(temperature);
    return availableActivities.filter((activity) => {
      const isTempValid = temp >= activity.temperatura[0] && temp <= activity.temperatura[1];
      const isWeatherValid = activity.estado.includes(weather.toLowerCase());
      return isTempValid && isWeatherValid;
    });
  }
  

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", width: "300px", backgroundColor: "#78baff", margin: "16px auto", fontFamily: "'Quicksand', sans-serif" }}>
      <h2 style={{ margin: "16px" }}>Consulta el clima por ciudad o manual</h2>
      <form onSubmit={handleSubmit} style={{ margin: "0 16px 16px 16px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Ingresa la ciudad (Clima actual):</label>
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Ej: Madrid"
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Ingresa el Clima (opcional):</label>
          <input
            type="text"
            value={inputWeather}
            onChange={(e) => setInputWeather(e.target.value)}
            placeholder="Ej: soleado, lluvia..."
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Ingresa la Temperatura (opcional):</label>
          <input
            type="number"
            value={inputTemperature === '' ? '' : Number(inputTemperature)}
            onChange={(e) => setInputTemperature(e.target.value)}
            placeholder="Ej: 23"
            style={{ width: "100%" }}
          />

        </div>
        <button type="submit" style={{ width: "100%", marginTop: "5px" }}>Mostrar clima</button>
      </form>

      {submitted && (
        <>
          <div style={{ margin: "8px 16px", border: "1px solid #4CAF50", borderRadius: "8px", backgroundColor: boxColor, textAlign: "center" }}>
            <h3>{apiCity  ? `Clima de Hoy en ${apiCity }` : 'Clima de Hoy'}</h3>
            <p style={{ fontSize: "2rem" }}>{emoji}</p>
            <p>{weather}</p>
            <p>🌡️ {temperature} °C</p>
          </div>

          <div style={{ margin: "8px 16px 16px 16px", border: "1px solid #4CAF50", borderRadius: "8px", backgroundColor: "#eaf7e1", textAlign: "center", minHeight: "200px" }}>
            <h4>Actividades realizables:</h4>
            {actividadesFiltradas.length > 0 ? (
              <ul style={{
                listStyleType: "none",
                margin: "8px 0",
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px"
              }}>
                {actividadesFiltradas.map((activity) => (
                  <li key={activity.name} style={{ textAlign: "center" }}>
                    <img src={activity.image} alt={activity.name} style={{ width: "50px", height: "50px" }} /><br />
                    {activity.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay actividades recomendadas para este clima.</p>
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