import React, { useState, useEffect, useCallback } from 'react'; //maejar variables, ejecutar código, memorizar funciones
import { getWeatherByCity, getForecastByCity } from '../api/weather'; //llamadas a la API
import { availableActivities } from '../components/activities';
import {
  Box, //contenedor
  TextField, //campo de texto
  Button, //boton
  Typography, //texto con estilos
  Card, //tarjeta con bordes y sombra
  CardContent, //interior de la tarjeta
  Stack, //organizar algo horizontal o verticalmente
  Chip, //teiqueta redondeada para mostrar información
} from '@mui/material';

//actualizar estados del componente (estado actual, funcion para actualizar estado = valor de inicio)
function WeatherStart() {
  const [inputCity, setInputCity] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [emoji, setEmoji] = useState('🌤️');
  //const [boxColor, setBoxColor] = useState('white');
  const [submitted, setSubmitted] = useState(false); //si se ingresa o envía una ciudad
  const [forecast, setForecast] = useState({}); // pronóstico proximos días
  const [humedad, setHumidity] = useState('');
  const [nubosidad, setClouds] = useState('');
  const [viento, setWind] = useState('');
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
  /*
  const availableActivities = [
    { name: 'Yoga', image: '/images/yoga.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Correr', image: '/images/correr.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'viento', 'niebla'] },
    { name: 'Leer', image: '/images/leer.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Estudiar React', image: '/images/estudiar react.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Ir al cine', image: '/images/ir al cine.webp', temperatura: [18, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir al gym', image: '/images/ir al gym.webp', temperatura: [16, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp', temperatura: [15, 23], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Cocinar', image: '/images/cocinar.webp', temperatura: [18, 23], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
  ];
  */

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

  //color de fondo para las cards
  /*
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
*/

  const obtenerClimaPorCiudad = useCallback(async (nombreCiudad) => {
    try {
      //onbtener datos del clima actual
      const data = await getWeatherByCity(nombreCiudad);
      const climaTraducido = traducirMainClima(data.weather[0].main);
      setCiudad(data.name);
      setWeather(climaTraducido);
      setTemperature(data.main.temp.toFixed(1));
      setHumidity(data.main.humidity);
      setClouds(data.clouds.all);
      setWind(data.wind.speed);
      setEmoji(getEmoji(climaTraducido));
      //icono que proporciona la API
      setIcono(data.weather[0].icon); 
      //setBoxColor(getBoxColor(climaTraducido));
      setSubmitted(true);

      // clima de los siguientes días, datos de forecast
      const forecastData = await getForecastByCity(nombreCiudad);
      const datosAgrupados = agruparForecastPorDia(forecastData.list);
      setForecast(datosAgrupados);
    } catch (error) {
      alert('No se pudo obtener el clima para esa ciudad.');
      setSubmitted(false);
      setForecast({});
    }
  }, []);

  // agrupar datos-intervalos por día
  const agruparForecastPorDia = (lista) => {
    //reduce(): recorre el arreglo por item y guarda en acc cada item segun la fecha
    return lista.reduce((listaPorDia, item) => {
      //dt_txt es fehca + hora, solo quiero la fecha
      const fecha = item.dt_txt.split(' ')[0]; // sacar la fecha
      //ve si ya existe la fecha en listaPorDia para ver si crear una fila o no
      if (!listaPorDia[fecha]) listaPorDia[fecha] = [];
      //guarda el item en la fecha
      listaPorDia[fecha].push(item);
      return listaPorDia;
    }, {});
  };
  
  //mostrar por defecto al inicio el clima de concepción
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
          minWidth: 50,
          //width: '70px',  
          marginRight: 1,
          //backgroundColor: getBoxColor(clima),
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
        {/* 
        <Typography variant="h5" component="div" sx={{ lineHeight: 1 }}>
          {emojiLocal}
        </Typography>
        */}
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

  // Extraemos los días para el pronóstico, sin el día actual, solo se muestran 4 días exactos
  const diasPronostico = Object.keys(forecast)
    .filter(fecha => fecha !== Object.keys(forecast)[0])
    .slice(0, 4);

  // Obtener actividades favoritas guardadas por el usuario
  const activitiesData = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
  const favoritosGuardados = activitiesData.undefined || []; // Solo lee de 'undefined'

  console.log("Favoritos guardados:", favoritosGuardados); // Verifica en consola

  // Filtrar solo las actividades marcadas como favoritas y disponibles en availableActivities
  const actividadesFavoritas = availableActivities.filter((act) => 
    favoritosGuardados.some(fav => fav === act.name)
  );

  const storedData = JSON.parse(localStorage.getItem('activitiesByDate')) || {};

  // Mueve 'general' y 'favorites' a 'undefined' (si existen)
  if (storedData.general || storedData.favorites) {
    storedData.undefined = [
      ...(storedData.undefined || []),
      ...(storedData.general || []),
      ...(storedData.favorites || [])
    ];
    delete storedData.general;
    delete storedData.favorites;
    localStorage.setItem('activitiesByDate', JSON.stringify(storedData));
    console.log("Datos unificados en 'undefined':", storedData.undefined);
  }
  //console.log('Actividades favoritas guardadas:', favoritosGuardados);

  console.log('Datos completos de localStorage:', activitiesData);
  console.log('Actividades combinadas:', favoritosGuardados);
  console.log('Actividades favoritas encontradas:', actividadesFavoritas);

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
        mt: 65,
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
          <Button variant="contained" sx={{width: '200px', height: '30px', fontSize: '18px', borderRadius: '12px'}} type="submit" >
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
                <Typography variant="h3"> {temperature}°</Typography>
                {icono && (
                <Box
                  component="img"
                  src={`https://openweathermap.org/img/wn/${icono}@2x.png`}
                  alt={weather}
                  sx={{ width: 80, height: 80 }}
                />
               )}
              </Box>
              {/* 
              {icono && (
                <Box
                  component="img"
                  src={`https://openweathermap.org/img/wn/${icono}@2x.png`}
                  alt={weather}
                  sx={{ width: 80, height: 80 }}
                />
              )}
                */}
              {/*
              <Typography variant="h2" component="p" sx={{ lineHeight: 1 }}>
                {emoji}
              </Typography> */}
              {/*
              <Typography variant="body1" sx={{ mb: 1 }}>
                {weather}
              </Typography>
              <Typography variant="h6">🌡️ {temperature} °C</Typography>
            */}
              </Card>

            {/* datos del clima actual */}
            <Card sx={{width: '200px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', padding: '16px', color: 'white' }} elevation={4}>
              <Typography variant="h6" gutterBottom>
                Detalles del clima
              </Typography>
              <Typography variant="body1">💧 Humedad: {humedad}%</Typography>
              <Typography variant="body1">☁️ Nubosidad: {nubosidad}%</Typography>
              <Typography variant="body1">💨 Viento: {viento} m/s</Typography>
            </Card>
          </Stack>
          {/*cards para los siguientes días*/}
          <Box sx={{ mb: 2 }}>
            {diasPronostico.map((fecha) => {
              const temps = forecast[fecha];
              const minTemp = Math.min(...temps.map(item => item.main.temp_min));
              const maxTemp = Math.max(...temps.map(item => item.main.temp_max));
              const estadosDelDia = temps.map(item => item.weather[0].main.toLowerCase());
              const fechaFormateada = new Date(fecha).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              // Filtrar actividades favoritas que cumplan con la temperatura y el estado del día
              // En WeatherStart.js, modifica esta parte:
              const actividadesFiltradas = actividadesFavoritas.filter((act) => {
                const tempOk = minTemp >= act.temperatura[0] && maxTemp <= act.temperatura[1];
                const climaOk = act.estado.some(e => weather.toLowerCase().includes(e.toLowerCase()));
                return tempOk && climaOk;
              });

              /*
              const actividadesFiltradas = actividadesFavoritas.filter(act =>
                act.temperatura[0] <= minTemp &&
                act.temperatura[1] >= maxTemp 
              );
              */

              return (
                <Box key={fecha} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'white' }}>
                    {`${fechaFormateada} (🌡️ mín: ${minTemp.toFixed(1)}°C / máx: ${maxTemp.toFixed(1)}°C)`}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                    {forecast[fecha].map(renderPronosticoHorario)}
                  </Stack>

                  <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, color: 'white' }}>
                    Actividades favoritas disponibles
                  </Typography>

                  {actividadesFiltradas.length > 0 ? (
                    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                      {actividadesFiltradas.map((act) => (
                        <Box key={act.name} sx={{ textAlign: 'center', color: 'white' }}>
                          <Box
                            component="img"
                            src={act.image}
                            alt={act.name}
                            sx={{ width: 50, height: 50, borderRadius: '8px', mb: 0.5 }}
                          />
                          <Typography variant="caption">{act.name}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'lightgray' }}>
                      No hay actividades favoritas compatibles para este día.
                    </Typography>
                  )}
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
