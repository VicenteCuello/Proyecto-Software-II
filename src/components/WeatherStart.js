import React, { useState, useEffect, useCallback } from 'react';
import { getWeatherByCity, getForecastByCity } from '../api/weather';

import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  Stack,
} from '@mui/material';

function WeatherStart() {
  const [inputCity, setInputCity] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [emoji, setEmoji] = useState('🌤️');
  const [boxColor, setBoxColor] = useState('white');
  const [submitted, setSubmitted] = useState(false);
  const [forecast, setForecast] = useState({}); // pronóstico proximos días

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
      Tornado: 'tormenta',
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
    if (w.includes('sol')) return '#FFF9C4';       // amarillo claro
    if (w.includes('lluvia')) return '#B3E5FC';    // azul claro
    if (
      w.includes('nublado') ||
      w.includes('tormenta') ||
      w.includes('viento') ||
      w.includes('nieve')
    )
      return '#CFD8DC';  // gris claro
    return '#FFFFFF';     // blanco
  };

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

      // datos de forecast
      const forecastData = await getForecastByCity(nombreCiudad);
      const agrupado = agruparForecastPorDia(forecastData.list);
      setForecast(agrupado);
    } catch (error) {
      alert('No se pudo obtener el clima para esa ciudad.');
      setSubmitted(false);
      setForecast({});
    }
  }, []);

  // agrupar datos po día
  const agruparForecastPorDia = (lista) => {
    return lista.reduce((acc, item) => {
      const fecha = item.dt_txt.split(' ')[0]; // sacar la fecha
      if (!acc[fecha]) acc[fecha] = [];
      acc[fecha].push(item);
      return acc;
    }, {});
  };

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

  // card para cada intervalo
  const renderPronosticoHorario = (item) => {
    const clima = traducirMainClima(item.weather[0].main);
    const temp = item.main.temp.toFixed(1);
    const hora = item.dt_txt.split(' ')[1].slice(0, 5); 
    const emojiLocal = getEmoji(clima);

    return (
      <Card
        key={item.dt}
        sx={{
          minWidth: 70,
          marginRight: 1,
          backgroundColor: getBoxColor(clima),
          textAlign: 'center',
          paddingY: 1,
          paddingX: 0.5,
        }}
        elevation={2}
      >
        <Typography variant="body2">{hora}</Typography>
        <Typography variant="h5" component="div" sx={{ lineHeight: 1 }}>
          {emojiLocal}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {clima}
        </Typography>
        <Typography variant="body2">🌡️ {temp}°C</Typography>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '16px auto',
        padding: 2,
        borderRadius: 2,
        backgroundColor: '#78baff',
        fontFamily: "'Quicksand', sans-serif",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, color: 'white' }}>
        Clima
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Ingresa la ciudad"
            variant="outlined"
            size="small"
            fullWidth
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Ej: Madrid"
          />
          <Button variant="contained" type="submit" fullWidth>
            Mostrar clima
          </Button>
        </Stack>
      </form>

      {submitted && (
        <>
          <Card sx={{ mb: 3, backgroundColor: boxColor, textAlign: 'center', p: 2 }} elevation={4}>
            <Typography variant="h6" gutterBottom>
              Clima de Hoy en {ciudad}
            </Typography>
            <Typography variant="h2" component="p" sx={{ lineHeight: 1 }}>
              {emoji}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {weather}
            </Typography>
            <Typography variant="h6">🌡️ {temperature} °C</Typography>
          </Card>

          <Box sx={{ mb: 2 }}>
            {Object.keys(forecast).map((fecha) => {
              if (fecha === Object.keys(forecast)[0]) return null; // saltamos el día actual

              return (
                <Box key={fecha} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'white' }}>
                    {new Date(fecha).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                    {forecast[fecha].map(renderPronosticoHorario)}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}

export default WeatherStart;
