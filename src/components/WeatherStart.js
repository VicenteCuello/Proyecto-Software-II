import React, { useState, useEffect, useCallback } from 'react'; //maejar variables, ejecutar código, memorizar funciones
import { getWeatherByCity, getForecastByCity, getWeatherByCoords } from '../api/weather'; //llamadas a la API

import {
  Box, //contenedor
  TextField, //campo de texto
  Button, //boton
  Typography, //texto con estilos
  Card, //tarjeta con bordes y sombra
  CardContent, //interior de la tarjeta
  Stack, //organizar algo horizontal o verticalmente
} from '@mui/material';

//actualizar estados del componente (estado actual, funcion para actualizar estado = valor de inicio)
function WeatherStart() {
  const [inputCity, setInputCity] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [weather, setWeather] = useState('');
  const [estadoClimatico, setEstadoClimatico] =useState('');
  const [temperature, setTemperature] = useState('');
  const [submitted, setSubmitted] = useState(false); //si se ingresa o envía una ciudad
  const [forecast, setForecast] = useState({}); // pronóstico proximos días
  const [humedad, setHumidity] = useState('');
  const [nubosidad, setClouds] = useState('');
  const [viento, setWind] = useState('');
  const [lluvia, setLluvia] = useState(0);
  const [icono, setIcono] = useState('');
  const traducirMainClima = (main) => {
    const traducciones = {
      Thunderstorm: 'Tormenta',
      Drizzle: 'Lluvia',
      Rain: 'Lluvia',
      Snow: 'Nieve',
      Clear: 'Soleado',
      Clouds: 'Nublado',
      Mist: 'Niebla',
      Smoke: 'Niebla',
      Haze: 'Niebla',
      Dust: 'Niebla',
      Fog: 'Niebla',
      Sand: 'Niebla',
      Ash: 'Niebla',
      Squall: 'Viento',
      Tornado: 'Tormenta',
    };
    return traducciones[main] || main.toLowerCase();
  };

  const obtenerClimaPorCiudad = useCallback(async (nombreCiudad) => {
    try {
      //onbtener datos del clima actual
      const data = await getWeatherByCity(nombreCiudad);
      const climaTraducido = traducirMainClima(data.weather[0].main);
      setCiudad(data.name);
      setWeather(climaTraducido);
      setEstadoClimatico(data.weather[0].description);
      setTemperature(data.main.temp.toFixed(1));
      setHumidity(data.main.humidity);
      setClouds(data.clouds.all);
      setWind(data.wind.speed);
      setLluvia(data.rain && data.rain['1h'] ? data.rain['1h'] : 0);
      //icono que proporciona la API
      setIcono(data.weather[0].icon); 
      setSubmitted(true);

      // clima de los siguientes días, datos de forecast
      const forecastData = await getForecastByCity(nombreCiudad);
      const datosAgrupados = agruparForecastPorDia(forecastData.list);
      setForecast(datosAgrupados);
    } catch (error) {
      alert('No se pudo obtener el clima para esa ciudad.');
      //setSubmitted(false);
      //setForecast({});
    }
  }, []);

  // agrupar datos-intervalos por día
  const agruparForecastPorDia = (lista) => {
    const listaPorDia = lista.reduce((acc, item) => {
      // Fecha local basada en timestamp
      const fechaLocal = new Date(item.dt * 1000);

      // Construir clave yyyy-mm-dd con la fecha local
      const año = fechaLocal.getFullYear();
      const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaLocal.getDate()).padStart(2, '0');
      const fechaClaveLocal = `${año}-${mes}-${dia}`;

      if (!acc[fechaClaveLocal]) acc[fechaClaveLocal] = [];
      acc[fechaClaveLocal].push({ ...item, horaLocal: fechaLocal });

      return acc;
    }, {});

    // Ordenar los arrays por hora ascendente dentro de cada día
    Object.keys(listaPorDia).forEach((fecha) => {
      listaPorDia[fecha].sort((a, b) => a.horaLocal - b.horaLocal);
    });

    return listaPorDia;
  };
  
  useEffect(() => {
    obtenerClimaPorCiudad('Santiago');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const data = await getWeatherByCoords(latitude, longitude);
            const climaTraducido = traducirMainClima(data.weather[0].main);
            setCiudad(data.name);
            setWeather(climaTraducido);
            setEstadoClimatico(data.weather[0].description);
            setTemperature(data.main.temp.toFixed(1));
            setHumidity(data.main.humidity);
            setClouds(data.clouds.all);
            setWind(data.wind.speed);
            setIcono(data.weather[0].icon);
            setSubmitted(true);

            const forecastData = await getForecastByCity(data.name);
            const datosAgrupados = agruparForecastPorDia(forecastData.list);
            setForecast(datosAgrupados);
          } catch (err) {
            obtenerClimaPorCiudad('Santiago');
          }
        },
        (err) => {
          obtenerClimaPorCiudad('Santiago');
        }
      );
    }/* else {
      obtenerClimaPorCiudad('Santiago');
    }*/
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
    //const hora = item.dt_txt.split(' ')[1].slice(0, 5); 
    const hora = new Date(item.dt * 1000).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Santiago',
    });
    const lluvia = Math.round((item.pop || 0) * 100);  
    return (
      <Card
        key={item.dt}
        sx={{
          minWidth: 50,
          //width: '70px',  
          marginRight: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)',
          //backgroundColor: '#3e538b',
          textAlign: 'center',
          //paddingY: 1,
          paddingY: "2px",
          paddingX: 0.5,
          color: 'white',
        }}
        elevation={2}
      >
        <Typography variant="body2">{hora}</Typography>
        <Box component="img"
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt={item.weather[0].description}
            sx={{ width: 40, height: 40 }}
        />
        <Box display="flex" flexDirection="column">
          <Typography variant="caption" display="block" gutterBottom >
            {clima}
          </Typography>
          <Typography variant="caption">🌡️ {temp}°C</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#FFFF' }}>
          🌧️ {lluvia}% 
        </Typography>
        <Typography variant="caption" sx={{ color: '#FFFF' }}>
          💨 {item.wind.speed} m/s
        </Typography>
        
      </Card>
    );
  };

  //variables para que el pronostico del día actual en forecast se usea en los datos actuales y no abajo
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  const fechaHoy = `${año}-${mes}-${dia}`;
  const pronosticoHoy = forecast[fechaHoy] || [];
  //pronostico siguientes días incluido el actual
  const diasPronostico = Object.keys(forecast)
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(0, 5);
  //pronostico de los siguientes días sin el actual
  const pronosticoSiguientesDias = diasPronostico.filter(fecha => fecha !== fechaHoy);
  //mostrar clima  
  return (
    <Box
      sx={{
        maxWidth: 1000,
        //width: 'valorpx',
        //hegiht: 'valorpx',
        backgroundImage: 'url(/images/clima.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        mt: -20,
        //margin: '16px auto',
        padding: 2,
        borderRadius: 2,
        //backgroundColor: '#78baff',
        fontFamily: "'Roboto', sans-serif",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, color: 'white' }}>
        Tiempo
      </Typography>

      <form onSubmit={handleSubmit}>
        {/*agrupar elementos de forma vertical*/}
        <Stack direction="column" spacing={2} sx={{ mb: 3}}>
          {/*campo para ingresar ciudad */}
          <TextField
            label="Ingresa la ciudad"
            
            variant="outlined"
            size="small"
            fullWidth
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Ej: Madrid"
            sx={{
              input: {color: 'white'},           // color del texto ingresado
              '& label': {
                color: 'white',
              },
            }}
          />
          <Button variant="contained" sx={{width: '180px', height: '25px', fontSize: '18px', borderRadius: '10px'}} type="submit" >
            Mostrar clima
          </Button>
        </Stack>
      </form>
      {/*mostrar card con el clima actual */}
      {submitted && (
        <>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {/* temperatura y estado climático del día actual */}
            <Card sx={{width: '200px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', p: 2, color: 'white', }} elevation={4}>
              <Typography variant="h6" gutterBottom>
                 {ciudad}
              </Typography>
              <Box display="flex" alignItems="center" gap={0}>
                <Typography variant="h3"> {temperature}<span style={{ verticalAlign: 'super', fontSize: '22px' }}>°C</span></Typography>
                {icono && (
                <Box
                  component="img"
                  src={`https://openweathermap.org/img/wn/${icono}@2x.png`}
                  alt={weather}
                  sx={{ width: 80, height: 80 }}
                />
               )}
              </Box>
              <Typography variant="body1" sx={{ mb: 1,"&::first-letter": {textTransform: "uppercase"}}}>
                {estadoClimatico}
              </Typography>
            </Card>

            {/* datos del clima actual */}
            <Card sx={{width: '250px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', padding: '16px', color: 'white' }} elevation={4}>
              <Typography variant="h6" gutterBottom>
                Detalles del clima
              </Typography>
              <Typography variant="body1">💧 Humedad: {humedad}%</Typography>
              <Typography variant="body1">☁️ Nubosidad: {nubosidad}%</Typography>
              <Typography variant="body1">💨 Viento: {viento} m/s</Typography>
              <Typography variant="body1">🌧️ Lluvia (última hora): {lluvia} mm</Typography>
            </Card>
            {/* Cards pronóstico horario día actual */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                alignItems: 'center',
                maxWidth: 500,
                paddingY: 1,
                paddingX: 0.5,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 1,
              }}
            >
              {pronosticoHoy.length > 0 ? (
                pronosticoHoy.map(renderPronosticoHorario)
              ) : (
                <Typography variant="body2" sx={{ color: 'white', px: 2 }}>
                  No hay pronóstico para hoy
                </Typography>
              )}
            </Box>
          </Stack>
          {/*cards para los siguientes días*/}
          <Box sx={{ mb: 2 }}>
            {pronosticoSiguientesDias.map((fecha) => (
              <Box key={fecha} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'white' }}>
                  {(() => {
                    const temps = forecast[fecha];
                    const minTemp = Math.min(...temps.map(item => item.main.temp_min)).toFixed(1);
                    const maxTemp = Math.max(...temps.map(item => item.main.temp_max)).toFixed(1);
                    const fechaObj = new Date(fecha + 'T00:00:00');
                    const fechaFormateada = fechaObj.toLocaleDateString('es-CL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                    return `${fechaFormateada} (🌡️ Mín: ${minTemp}°C - Máx: ${maxTemp}°C)`;
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
