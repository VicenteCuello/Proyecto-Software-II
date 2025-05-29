import React, { useState, useEffect, useCallback } from 'react';
import { getWeatherByCity, getForecastByCity } from '../api/weather';

import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
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
  const [humedad, setHumidity] = useState('');
  const [nubosidad, setClouds] = useState('');
  const [viento, setWind] = useState('');
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
    if (w.includes('sol')) return '#f3e87b';       // amarillo claro
    if (w.includes('lluvia')) return '#B3E5FC';    // azul claro
    if (
      w.includes('nublado') ||
      w.includes('tormenta') ||
      w.includes('viento') ||
      w.includes('nieve')
    )
      return '#57687a';  // gris claro
    return '#FFFFFF';     // blanco
  };

  const obtenerClimaPorCiudad = useCallback(async (nombreCiudad) => {
    try {
      const data = await getWeatherByCity(nombreCiudad);
      const climaTraducido = traducirMainClima(data.weather[0].main);
      setCiudad(data.name);
      setWeather(climaTraducido);
      setTemperature(data.main.temp.toFixed(1));
      setHumidity(data.main.humidity);
      setClouds(data.clouds.all);
      setWind(data.wind.speed);
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
    const lluvia = Math.round((item.pop || 0) * 100); 

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
        <Typography variant="caption" sx={{ color: '#FFFF' }}>
          🌧️ {lluvia}% 
        </Typography>
        <Typography variant="caption" sx={{ color: '#FFFF' }}>
           💨 {item.wind.speed} m/s
        </Typography>
        </Card>
    );
  };

  // Extraemos las fechas para pronóstico, excluyendo el día actual, y limitamos a 4 días
  const fechasPronostico = Object.keys(forecast)
    .filter(fecha => fecha !== Object.keys(forecast)[0])
    .slice(0, 4);
    
  return (
    <Box
      sx={{
        maxWidth: 1000,
        //width: 'valorpx',
        //hegiht: 'valorpx',
        //backgroundImage: 'url(/images/clima.jpg)',
        //backgroundSize: 'cover',
        //backgroundPosition: 'center',
        //backgroundRepeat: 'no-repeat',
        margin: '16px auto',
        padding: 2,
        borderRadius: 2,
        backgroundColor: '#78baff',
        fontFamily: "'Quicksand', sans-serif",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, color: 'white' }}>
        Tiempo
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
          <Button variant="contained" sx={{width: '200px', height: '30px', fontSize: '18px', borderRadius: '12px'}} type="submit" >
            Mostrar clima
          </Button>
        </Stack>
      </form>

      {submitted && (
        <>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {/* temperatura y estado climático del día actual */}
            <Card sx={{ flex: 1, backgroundColor: boxColor, textAlign: 'center', p: 2 }} elevation={4}>
              <Typography variant="h6" gutterBottom>
                 {ciudad}
              </Typography>
              <Typography variant="h2" component="p" sx={{ lineHeight: 1 }}>
                {emoji}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {weather}
              </Typography>
              <Typography variant="h6">🌡️ {temperature} °C</Typography>
            </Card>

            {/* datos del clima actual */}
            <Card sx={{ flex: 1, backgroundColor: '#437ebb', textAlign: 'center', padding: '16px' }} elevation={4}>
              <Typography variant="h6" gutterBottom>
                Detalles del clima
              </Typography>
              <Typography variant="body1">💧 Humedad: {humedad}%</Typography>
              <Typography variant="body1">☁️ Nubosidad: {nubosidad}%</Typography>
              <Typography variant="body1">💨 Viento: {viento} m/s</Typography>
            </Card>
          </Stack>

          {/*
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
            <Typography variant="body2">💧 Humedad: {humedad}%</Typography>
            <Typography variant="body2">☁️ Nubosidad: {nubosidad}%</Typography>
            <Typography variant="body2">💨 Viento: {viento} m/s</Typography>
          </Card>
*/}
          <Box sx={{ mb: 2 }}>
            {fechasPronostico.map((fecha) => (
              <Box key={fecha} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'black' }}>
                  {(() => {
                    const temps = forecast[fecha];
                    const minTemp = Math.min(...temps.map(item => item.main.temp_min)).toFixed(1);
                    const maxTemp = Math.max(...temps.map(item => item.main.temp_max)).toFixed(1);
                    const fechaFormateada = new Date(fecha).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                    return `${fechaFormateada} (🌡️ mín: ${minTemp}°C / máx: ${maxTemp}°C)`;
                  })()}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                  {forecast[fecha].map(renderPronosticoHorario)}
                </Stack>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default WeatherStart;
