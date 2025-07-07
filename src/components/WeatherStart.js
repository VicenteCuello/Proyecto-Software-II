import React, { useState, useEffect, useCallback, useContext } from 'react'; //maejar variables, ejecutar código, memorizar funciones
import { getWeatherByCity, getForecastByCity, getWeatherByCoords } from '../api/weather'; //llamadas a la API
import { availableActivities } from '../components/activities';
import { CityContext } from './CityContext';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';


import {
  Box, //contenedor
  TextField, //campo de texto
  Button, //boton
  Typography, //texto con estilos
  Card, //tarjeta con bordes y sombra
  Stack, //organizar algo horizontal o verticalmente
  Alert, // Importar Alert
  AlertTitle, // Importar AlertTitle
} from '@mui/material';


// Componente para mostrar actividades recomendadas en un box fijo
function ActividadesRecomendadas({ diasPronostico, forecast, favoriteActivities, traducirMainClima, ciudad }) {
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);

  const handleDiaAnterior = () => {
    setDiaSeleccionado((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleDiaSiguiente = () => {
    setDiaSeleccionado((prev) => (prev < diasPronostico.length - 1 ? prev + 1 : prev));
  };

  const fechaActiva = diasPronostico[diaSeleccionado];
  const tempsDia = forecast[fechaActiva] || [];
  const minTempDia = tempsDia.length > 0 ? Math.min(...tempsDia.map(item => item.main.temp_min)) : 0;
  const maxTempDia = tempsDia.length > 0 ? Math.max(...tempsDia.map(item => item.main.temp_max)) : 0;
  const estadosDelDia = tempsDia.map(item => traducirMainClima(item.weather[0].main).toLowerCase());

  const actividadesFiltradasDia = favoriteActivities.filter(act => {
    if (!act.temperatura || !Array.isArray(act.temperatura) || act.temperatura.length < 2) {
      return false;
    }
    if (!act.estado || !Array.isArray(act.estado)) {
      return false;
    }
    const tempOk = minTempDia >= act.temperatura[0] && maxTempDia <= act.temperatura[1];
    const climaOk = act.estado.some(e => estadosDelDia.includes(e.toLowerCase()));
    return tempOk && climaOk;
  });

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 120,
        top: 60,
        width: 350,
        //height: '85vh',
        height: '50vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 2,
        padding: 2,
        overflowY: 'auto',
        color: 'white',
        boxShadow: 3,
        fontFamily: "'Roboto', sans-serif",
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold'}}>
        🌟 Actividades favoritas recomendadas en {ciudad}
      </Typography>
      {/* Navegación de días */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleDiaAnterior}
          disabled={diaSeleccionado === 0}
          sx={{
            minWidth: 32,
            height: 32,
            fontSize: '18px',
            borderRadius: '50%', // hacerlo más redondo
            padding: 0,
          }}
        >
          {'<'}
        </Button>
        <Typography variant="subtitle1" sx={{ alignSelf: 'center', fontWeight: 'bold' }}>
          {fechaActiva ? new Date(fechaActiva + 'T00:00:00').toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) : ''}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={handleDiaSiguiente}
          disabled={diaSeleccionado === diasPronostico.length - 1}
          sx={{
            minWidth: 32,
            height: 32,
            fontSize: '18px',
            borderRadius: '50%', // hacerlo más redondo
            padding: 0,
          }}
        >
          {'>'}
        </Button>
      </Box>

      {/* Lista actividades filtradas */}
      {actividadesFiltradasDia.length > 0 ? (
        <Stack direction="column" spacing={2} sx={{ overflowY: 'auto' }}>
          {actividadesFiltradasDia.map((act) => (
            <Box
              key={act.name}
              sx={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                pb: 1,
              }}
            >
              <Box
                component="img"
                src={act.image}
                alt={act.name}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{act.name}</Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
          No hay actividades compatibles con el clima de este día.
        </Typography>
      )}
    </Box>
  );
}

function ActividadesAgendadas({ diasPronostico, scheduledActivities, forecastPorCiudad, traducirMainClima }) {
  console.log(" Dias del pronóstico:", diasPronostico);
  console.log("Actividades agendadas recibidas como props:", scheduledActivities);
  return (
    <Box
     sx={{
        position: 'fixed',
        left: 120,
        top: 455,
        width: 350,
        height: '30vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 2,
        padding: 2,
        overflowY: 'auto',
        color: 'white',
        boxShadow: 3,
        fontFamily: "'Roboto', sans-serif",
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        📅 Actividades agendadas
      </Typography>

      {diasPronostico.map((fecha) => {
        const actividadesDelDia = scheduledActivities.filter((act) => {
          const fechaLocal = new Date(act.scheduled_date).toLocaleDateString('sv-SE');
          return fechaLocal === fecha;
        });

        return (
          <Box key={fecha} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {new Date(fecha + 'T00:00:00').toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>

            {actividadesDelDia.length > 0 ? (
              actividadesDelDia.map((act) => {
                // hacer análisis usando act.location
                const tempsDia = (
                  forecastPorCiudad &&
                  act.location &&
                  forecastPorCiudad[act.location] &&
                  forecastPorCiudad[act.location][fecha]
                ) ? forecastPorCiudad[act.location][fecha] : [];
                const minTempDia = tempsDia.length > 0 ? Math.min(...tempsDia.map(item => item.main.temp_min)) : null;
                const maxTempDia = tempsDia.length > 0 ? Math.max(...tempsDia.map(item => item.main.temp_max)) : null;
                const estadosDelDia = tempsDia.map(item => traducirMainClima(item.weather[0].main).toLowerCase());

                const compatible = (() => {
                  if (!act.temperatura || act.temperatura.length < 2) return false;
                  if (!act.estado || !Array.isArray(act.estado)) return false;
                  const tempOk = minTempDia >= act.temperatura[0] && maxTempDia <= act.temperatura[1];
                  const climaOk = act.estado.some(e => estadosDelDia.includes(e.toLowerCase()));
                  return tempOk && climaOk;
                })();

                return (
                  <Box
                    key={act.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 1,
                      padding: 1,
                    }}
                  >
                    {/* Círculo verde o rojo */}
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: compatible ? 'green' : 'red',
                        flexShrink: 0,
                      }}
                    />
                    <Box
                      component="img"
                      src={act.image}
                      alt={act.name}
                      sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {act.name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                        Ciudad: {act.location}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                No hay actividades agendadas para este día.
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

//actualizar estados del componente (estado actual, funcion para actualizar estado = valor de inicio)
function WeatherStart() {
  const [inputCity, setInputCity] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [weather, setWeather] = useState('');
  const [estadoClimatico, setEstadoClimatico] =useState('');
  const [temperature, setTemperature] = useState('');
  const [submitted, setSubmitted] = useState(false); //si se ingresa o envía una ciudad
  const [forecast, setForecast] = useState({}); // pronóstico proximos días
  const [forecastPorCiudad, setForecastPorCiudad] = useState({});
  const [humedad, setHumidity] = useState('');
  const [nubosidad, setClouds] = useState('');
  const [viento, setWind] = useState('');
  const [lluvia, setLluvia] = useState(0);
  const [icono, setIcono] = useState('');
  const { setCity: setGlobalCity, hasCalendarAlert } = useContext(CityContext); // Obtener el estado de la alerta
  
  //const [hasCalendarAlert, setHasCalendarAlert] = useState(true);

  const traducirMainClima = (main) => {
    const traducciones = {
      Thunderstorm: 'Tormenta', Drizzle: 'lluvioso', Rain: 'lluvioso', Snow: 'Nieve',
      Clear: 'Soleado', Clouds: 'Nublado', Mist: 'Niebla', Smoke: 'Niebla', Haze: 'Niebla',
      Dust: 'Niebla', Fog: 'Niebla', Sand: 'Niebla', Ash: 'Niebla', Squall: 'Viento',Tornado: 'Tormenta',
    };
    return traducciones[main] || main.toLowerCase();
  };

  //obtener actividades favoritas del usuario
  const [favoriteActivities, setFavoriteActivities] = useState([]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json(); // [{id, name, image}, ...]

        // enlazar cada actividad favorita con su versión completa (que tiene temperatura y estado)
        const favoritasCompletas = data.map((fav) => {
          const completa = availableActivities.find((a) => a.id === fav.id);
          return {
            ...fav,
            temperatura: completa?.temperatura || [],
            estado: completa?.estado || []
          };
        });

        setFavoriteActivities(favoritasCompletas);
      } catch (err) {
        console.error('Error fetching favorite activities:', err);
        setFavoriteActivities([]);
      }
    };

    fetchFavorites();
  }, []);

  //obtener actividades agendadas
  const [scheduledActivities, setScheduledActivities] = useState([]); // actividades agendadas

  const fetchScheduledActivities = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/schedule`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al obtener actividades agendadas');
      const data = await res.json();
      const enriquecidas = data.map((act) => {
        const completa = availableActivities.find((a) => a.id === act.id);
        return {
          ...act,
          temperatura: completa?.temperatura || [],
          estado: completa?.estado || []
        };
      });

      setScheduledActivities(enriquecidas);
      console.log("Actividades agendadas recibidas del backend:", data);
      const ciudadesUnicas = [...new Set(data.map(act => act.location))];

      const pronosticos = await Promise.all(
        ciudadesUnicas.map(async (ciudad) => {
          const data = await getForecastByCity(ciudad);
          const datosAgrupados = agruparForecastPorDia(data.list);
          return [ciudad, datosAgrupados];
        })
      );

      const forecastObj = Object.fromEntries(pronosticos);
      setForecastPorCiudad(forecastObj);
    } catch (error) {
      console.error("Error al cargar actividades agendadas:", error);
      setScheduledActivities([]);
    }
  }, []);

  useEffect(() => {
    fetchScheduledActivities();
  }, [fetchScheduledActivities]);

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
      //  ACTUALIZAR EL CONTEXTO GLOBAL
      setGlobalCity(data.name);
      //icono que proporciona la API
      setIcono(data.weather[0].icon); 
      setSubmitted(true);

      // clima de los siguientes días, datos de forecast
      const forecastData = await getForecastByCity(nombreCiudad);
      const datosAgrupados = agruparForecastPorDia(forecastData.list);
      setForecast(datosAgrupados);
    } catch (error) {
      alert('No se pudo obtener el clima para esa ciudad.');
    }
  }, [setGlobalCity]);

  // agrupar datos-intervalos por día
  const agruparForecastPorDia = (lista) => {
    const listaPorDia = lista.reduce((acc, item) => {
      //fecha local en timestamp
      const fechaLocal = new Date(item.dt * 1000);

      // armar fecha con fecha local
      const año = fechaLocal.getFullYear();
      const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaLocal.getDate()).padStart(2, '0');
      const fechaClaveLocal = `${año}-${mes}-${dia}`;

      if (!acc[fechaClaveLocal]) acc[fechaClaveLocal] = [];
      acc[fechaClaveLocal].push({ ...item, horaLocal: fechaLocal });

      return acc;
    }, {});

    // ordenar los arrays por hora ascendente dentro de cada día
    Object.keys(listaPorDia).forEach((fecha) => {
      listaPorDia[fecha].sort((a, b) => a.horaLocal - b.horaLocal);
    });

    return listaPorDia;
  };
  

  useEffect(() => {
    obtenerClimaPorCiudad('Concepcion');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Latitud:', latitude);
          console.log('Longitud:', longitude);
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
            setGlobalCity(data.name);
            setIcono(data.weather[0].icon);
            setSubmitted(true);

            const forecastData = await getForecastByCity(data.name);
            const datosAgrupados = agruparForecastPorDia(forecastData.list);
            setForecast(datosAgrupados);
          } catch (err) {
            obtenerClimaPorCiudad('Concepcion');
          }
        },
        (err) => {
          obtenerClimaPorCiudad('Concepcion');
        }
      );
    } else {
        obtenerClimaPorCiudad('Concepcion');
    }
  }, [obtenerClimaPorCiudad, setGlobalCity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim() !== '') {
      obtenerClimaPorCiudad(inputCity.trim());
      setInputCity('');
    }
  };
  
  // card para cada intervalo
  const renderPronosticoHorario = (item) => {
    //const clima = traducirMainClima(item.weather[0].main);
    const clima = item.weather[0].description;
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
          minWidth: 115,
          //width: '150px',  
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
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{hora}</Typography>
        <Box component="img"
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt={item.weather[0].description}
            sx={{ width: 40, height: 40 }}
        />
        <Box display="flex" flexDirection="column">
          <Typography variant="caption" display="block" gutterBottom  sx={{ fontWeight: 'bold', "&::first-letter": {textTransform: "uppercase"}}}>
            {clima}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>🌡️ {temp}°C</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#FFFF', fontWeight: 'bold' }}>
          🌧️ {lluvia}%  
        </Typography>
        <Typography variant="caption" sx={{ color: '#FFFF', marginLeft: '2px', fontWeight: 'bold' }}>
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
  const minTempHoy = pronosticoHoy.length > 0
  ? Math.min(...pronosticoHoy.map(item => item.main.temp_min)).toFixed(1)
  : null;
  const maxTempHoy = pronosticoHoy.length > 0
    ? Math.max(...pronosticoHoy.map(item => item.main.temp_max)).toFixed(1)
    : null;
  //pronostico siguientes días incluido el actual
  const diasPronostico = Object.keys(forecast)
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(0, 5);
  //pronostico de los siguientes días sin el actual
  const pronosticoSiguientesDias = diasPronostico.filter(fecha => fecha !== fechaHoy);
  const [indiceInicio, setIndiceInicio] = useState(0);
  const handleAnterior = () => {
    setIndiceInicio(prev => Math.max(prev - 1, 0));
  };
  const handleSiguiente = () => {
    setIndiceInicio(prev => Math.min(prev + 1, diasPronostico.length - 1));
  };

  
  const [mostrarAlerta, setMostrarAlerta] = useState(true);
  return (
    <>
    {/* Mensaje de advertencia fijo  */}
    {hasCalendarAlert && mostrarAlerta && (
        <Box
          sx={{
            position: 'fixed',
            top: 550,
            left: 50,
            width: 320,
            zIndex: 1150,
          }}
        >
          <Alert
            severity="warning"
            variant="filled"
            sx={{ borderRadius: 2, position: 'relative' }}
            action={
              <Button
                size="small"
                onClick={() => setMostrarAlerta(false)}
                sx={{
                  color: 'white',
                  minWidth: 'auto',
                  padding: 0,
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
              >
                <CloseIcon fontSize="small" />
              </Button>
            }
          >
            <AlertTitle>Advertencia</AlertTitle>
            Una o más actividades registradas en el calendario{' '}
            <strong>ya no se recomiendan</strong> debido a las condiciones climáticas actuales.
          </Alert>
        </Box>
      )}
      

    {/*mostrar clima*/}
    <Box
      sx={{
        position: 'fixed',
        top: '60px',
        right: '120px',
        width: '90vw',
        maxWidth: 700,
        height: 600,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 2,
        borderRadius: 2,
        fontFamily: "'Roboto', sans-serif",
        boxShadow: 3,
      }}
    > 
      <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
        🌆 Buscar una ciudad
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <TextField
          label="Ingresa la ciudad"
          variant="outlined"
          size="small"
          fullWidth
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Ej: Madrid"
          sx={{
            input: { color: 'white' },
            '& label': { color: 'white' },
          }}
          InputProps={{
            endAdornment: (
              <Button type="submit" sx={{ minWidth: 0, padding: '6px', color: 'white' }}>
                <SearchIcon />
              </Button>
            ),
          }}
        />
      </form>
      <Typography variant="h5" align="center" component="h2" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'bold'}}>
        ☀️ Tiempo de hoy
      </Typography>
      {/*mostrar card con el clima actual */}
      {submitted && (
        <>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            {/* temperatura y estado climático del día actual */}
            <Card sx={{width: '200px', height: '130px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', p: 2, color: 'white', }} elevation={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {ciudad}
              </Typography>
              <Box display="flex" alignItems="center" gap={0}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}> {temperature}<span style={{ verticalAlign: 'super', fontSize: '22px' }}>°C</span></Typography>
                {icono && (
                  <Box
                    component="img"
                    src={`https://openweathermap.org/img/wn/${icono}@2x.png`}
                    alt={weather}
                    sx={{ width: 80, height: 80 }}
                  />
                )}
              </Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', "&::first-letter": {textTransform: "uppercase"}}}>
                {estadoClimatico}
              </Typography>
            </Card>

            {/* datos del clima actual */}
            <Card sx={{width: '250px', height: '130px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', padding: '16px', color: 'white' }} elevation={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}> 
                Detalles del clima
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>💧 Humedad: {humedad}%</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>☁️ Nubosidad: {nubosidad}%</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>💨 Viento: {viento} m/s</Typography>
            </Card>
          </Stack>
          <Typography variant="h6" align="center" sx={{ mb: 2, color: 'white', fontWeight: 'bold'}}>
            🔮 Pronóstico diario
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleAnterior}
              disabled={indiceInicio === 0}
              //sx={{ mr: 1 }}
              sx={{
                minWidth: 32,
                height: 32,
                fontSize: '18px',
                borderRadius: '50%', // hacerlo más redondo
                padding: 0,
              }}
            >
              {'<'}
            </Button>

            <Box sx={{ minWidth: 220, width: '100%' }}>
              <Typography variant="subtitle1" align="center" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                {(() => {
                  const fecha = diasPronostico[indiceInicio];
                  const fechaFormateada = new Date(fecha + 'T00:00:00').toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  const temps = forecast[fecha] || [];
                  const minTemp = temps.length > 0 ? Math.min(...temps.map(item => item.main.temp_min)).toFixed(1) : null;
                  const maxTemp = temps.length > 0 ? Math.max(...temps.map(item => item.main.temp_max)).toFixed(1) : null;

                  return `${fechaFormateada}${minTemp && maxTemp ? `  (🌡️ Mín: ${minTemp}°C / Máx: ${maxTemp}°C)` : ''}`;
                })()}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                {(forecast[diasPronostico[indiceInicio]] || []).map(renderPronosticoHorario)}
              </Stack>
            </Box>

            <Button
              variant="contained"
              size="small"
              onClick={handleSiguiente}
              disabled={indiceInicio === diasPronostico.length - 1}
              //sx={{ ml: 1 }}
              sx={{
                minWidth: 32,
                height: 32,
                fontSize: '18px',
                borderRadius: '50%', // hacerlo más redondo
                padding: 0,
              }}
            >
              {'>'}
            </Button>
          </Box>
        </>
      )}
    </Box>
    {/* Box actividades recomendadas fijo  */}
      <ActividadesRecomendadas
        diasPronostico={diasPronostico}
        forecast={forecast}
        favoriteActivities={favoriteActivities}
        traducirMainClima={traducirMainClima}
        ciudad={ciudad}
      />
      <ActividadesAgendadas diasPronostico={diasPronostico}
        scheduledActivities={scheduledActivities}
        forecastPorCiudad={forecastPorCiudad}
        traducirMainClima={traducirMainClima}/>
      </>
  );
}
export default WeatherStart;

