import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getWeatherByCity, getForecastByCity, getWeatherByCoords } from '../api/weather';
import { CityContext } from './CityContext';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';

import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider 
} from '@mui/material';


// Panel unificado que muestra ambas secciones.
function PanelActividades({
  favoriteActivities,
  scheduledActivities,
  allActivities,
  forecast,
  fechaHoy,
  ciudad,
  traducirMainClima,
  loading
}) {

  // --- Lógica común para obtener el clima de hoy ---
  const forecastForToday = forecast[fechaHoy] || [];
  let minTemp, maxTemp, weatherStates;

  if (forecastForToday.length > 0) {
    const temps = forecastForToday.map(item => item.main.temp);
    minTemp = Math.min(...temps);
    maxTemp = Math.max(...temps);
    weatherStates = [...new Set(forecastForToday.map(item => traducirMainClima(item.weather[0].main).toLowerCase()))];
  }

  // --- Sección 1: Actividades Favoritas Recomendadas ---
  const renderRecommendedFavorites = () => {
    if (loading || !minTemp) {
      return (
        <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', my: 1 }}>
          Cargando recomendaciones...
        </Typography>
      );
    }
    
    const recommended = favoriteActivities.filter(act => {
      if (!act.temperatura || !act.estado) return false;
      const tempOk = minTemp >= act.temperatura[0] && maxTemp <= act.temperatura[1];
      const weatherOk = act.estado.some(e => weatherStates.includes(e.toLowerCase()));
      return tempOk && weatherOk;
    });

    if (recommended.length === 0) {
      return (
        <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', my: 1 }}>
          Ninguna de tus actividades favoritas es recomendable hoy.
        </Typography>
      );
    }

    return (
      <Stack spacing={1.5}>
        {recommended.map(act => (
          <Box key={act.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box component="img" src={act.image} alt={act.name} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
            <Typography variant="body1">{act.name}</Typography>
          </Box>
        ))}
      </Stack>
    );
  };

  // --- Sección 2: Actividades Agendadas para Hoy ---
  const renderScheduledToday = () => {
    if (loading) {
       return <CircularProgress size={20} sx={{ color: 'white', display: 'block', margin: '10px auto' }} />;
    }

    const activitiesForToday = scheduledActivities.filter(act => 
        new Date(act.scheduled_date).toISOString().split('T')[0] === fechaHoy && act.location === ciudad
    );
    
    if (activitiesForToday.length === 0) {
      return (
        <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', my: 1 }}>
          No hay actividades agendadas para hoy.
        </Typography>
      );
    }
    
    if (!minTemp) {
      return (
        <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center', my: 1 }}>
          Esperando datos del clima...
        </Typography>
      );
    }

    return (
      <Stack spacing={1.5}>
        {activitiesForToday.map((scheduledAct) => {
          const activityDetails = allActivities.find(a => a.name === scheduledAct.name);
          if (!activityDetails) return null;

          const tempOk = minTemp >= activityDetails.temperatura[0] && maxTemp <= activityDetails.temperatura[1];
          const weatherOk = activityDetails.estado.some(e => weatherStates.includes(e));
          const isRecommended = tempOk && weatherOk;

          return (
            <Box key={scheduledAct.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CircleIcon sx={{ fontSize: 16, color: isRecommended ? '#4caf50' : '#f44336' }} />
              <Typography variant="body1">{activityDetails.name}</Typography>
            </Box>
          );
        })}
      </Stack>
    );
  };

  return (
    <Box sx={{ position: 'fixed', left: 120, top: 60, width: 320, maxHeight: '80vh', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 2, padding: 2, overflowY: 'auto', color: 'white', boxShadow: 3, zIndex: 1100 }}>
      {/* Sección de Recomendadas (Favoritas) */}
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold'}}>
        🌟 Recomendadas para Hoy
      </Typography>
      {renderRecommendedFavorites()}

      {/* Separador */}
      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      {/* Sección de Agendadas (Calendario) */}
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold'}}>
        ✅ Agendadas para Hoy
      </Typography>
      {renderScheduledToday()}
    </Box>
  );
}


function WeatherStart() {
  const [inputCity, setInputCity] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [weather, setWeather] = useState('');
  const [estadoClimatico, setEstadoClimatico] =useState('');
  const [temperature, setTemperature] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [forecast, setForecast] = useState({});
  const [humedad, setHumidity] = useState('');
  const [nubosidad, setClouds] = useState('');
  const [viento, setWind] = useState('');
  const [icono, setIcono] = useState('');
  const { setCity: setGlobalCity, hasCalendarAlert } = useContext(CityContext);

  const [allActivities, setAllActivities] = useState([]);
  const [scheduledActivities, setScheduledActivities] = useState([]);
  const [favoriteActivities, setFavoriteActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const traducirMainClima = (main) => {
    const traducciones = {
      Thunderstorm: 'tormenta', Drizzle: 'lluvioso', Rain: 'lluvioso', Snow: 'nieve',
      Clear: 'soleado', Clouds: 'nublado', Mist: 'niebla', Smoke: 'niebla', Haze: 'niebla',
      Dust: 'niebla', Fog: 'niebla', Sand: 'niebla', Ash: 'niebla', Squall: 'viento',Tornado: 'tormenta',
    };
    return traducciones[main] || main.toLowerCase();
  };

  // Carga de TODAS las actividades y sus detalles
  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/activities`);
        const data = await response.json();
        setAllActivities(data);
        return data; // Devuelve los datos para usarlos en la carga de favoritos
      } catch (err) {
        console.error('Error fetching all activities:', err);
        return [];
      }
    };

    // Carga de actividades FAVORITAS
    const fetchFavorites = async (activities) => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        const favoritasCompletas = data.map((fav) => {
          const completa = activities.find((a) => a.id === fav.id);
          return { ...fav, ...completa };
        });
        setFavoriteActivities(favoritasCompletas);
      } catch (err) {
        console.error('Error fetching favorite activities:', err);
      }
    };

    // Carga de actividades AGENDADAS
    const fetchScheduled = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/schedule`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setScheduledActivities(data);
      } catch (err) {
        console.error('Error fetching scheduled activities:', err);
      }
    };

    // Orquestador de carga
    const loadAllData = async () => {
      setLoadingActivities(true);
      const allActs = await fetchAllActivities();
      await Promise.all([
        fetchFavorites(allActs),
        fetchScheduled()
      ]);
      setLoadingActivities(false);
    };

    loadAllData();
  }, []);

  
  const obtenerClimaPorCiudad = useCallback(async (nombreCiudad) => {
    try {
      const data = await getWeatherByCity(nombreCiudad);
      setCiudad(data.name);
      setEstadoClimatico(data.weather[0].description);
      setTemperature(data.main.temp.toFixed(1));
      setHumidity(data.main.humidity);
      setClouds(data.clouds.all);
      setWind(data.wind.speed);
      setIcono(data.weather[0].icon); 
      setSubmitted(true);
      const forecastData = await getForecastByCity(nombreCiudad);
      const datosAgrupados = agruparForecastPorDia(forecastData.list);
      setForecast(datosAgrupados);
    } catch (error) {
      alert('No se pudo obtener el clima para esa ciudad.');
    }
  }, []);

  const agruparForecastPorDia = (lista) => {
    const listaPorDia = lista.reduce((acc, item) => {
      const fechaLocal = new Date(item.dt * 1000);
      const año = fechaLocal.getFullYear();
      const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaLocal.getDate()).padStart(2, '0');
      const fechaClaveLocal = `${año}-${mes}-${dia}`;
      if (!acc[fechaClaveLocal]) acc[fechaClaveLocal] = [];
      acc[fechaClaveLocal].push({ ...item, horaLocal: fechaLocal });
      return acc;
    }, {});
    Object.keys(listaPorDia).forEach((fecha) => {
      listaPorDia[fecha].sort((a, b) => a.horaLocal - b.horaLocal);
    });
    return listaPorDia;
  };
  
  useEffect(() => {
    obtenerClimaPorCiudad('Concepcion');
  }, [obtenerClimaPorCiudad]);

  const handleSubmit = (e) => { e.preventDefault(); if (inputCity.trim() !== '') { obtenerClimaPorCiudad(inputCity.trim()); setInputCity(''); } };
  const renderPronosticoHorario = (item) => { const clima = item.weather[0].description; const temp = item.main.temp.toFixed(1); const hora = new Date(item.dt * 1000).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Santiago', }); const lluvia = Math.round((item.pop || 0) * 100); return ( <Card key={item.dt} sx={{ minWidth: 115, marginRight: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', paddingY: "2px", paddingX: 0.5, color: 'white', }} elevation={2}> <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{hora}</Typography> <Box component="img" src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} sx={{ width: 40, height: 40 }} /> <Box display="flex" flexDirection="column"> <Typography variant="caption" display="block" gutterBottom sx={{ fontWeight: 'bold', "&::first-letter": {textTransform: "uppercase"}}}>{clima}</Typography> <Typography variant="caption" sx={{ fontWeight: 'bold' }}>🌡️ {temp}°C</Typography> </Box> <Typography variant="caption" sx={{ color: '#FFFF', fontWeight: 'bold' }}>🌧️ {lluvia}%</Typography> <Typography variant="caption" sx={{ color: '#FFFF', marginLeft: '2px', fontWeight: 'bold' }}>💨 {item.wind.speed} m/s</Typography> </Card> ); };
  const hoy = new Date(); const año = hoy.getFullYear(); const mes = String(hoy.getMonth() + 1).padStart(2, '0'); const dia = String(hoy.getDate()).padStart(2, '0'); const fechaHoy = `${año}-${mes}-${dia}`;
  const diasPronostico = Object.keys(forecast).sort((a, b) => new Date(a) - new Date(b)).slice(0, 5); const [indiceInicio, setIndiceInicio] = useState(0); const handleAnterior = () => setIndiceInicio(prev => Math.max(prev - 1, 0)); const handleSiguiente = () => setIndiceInicio(prev => Math.min(prev + 1, diasPronostico.length - 1));

  return (
    <>
      {hasCalendarAlert && ( <Box sx={{ position: 'fixed', top: 500, left: 120, width: 350, zIndex: 1100, }}> <Alert severity="warning" variant="filled" sx={{ borderRadius: 2 }}> <AlertTitle>Advertencia</AlertTitle> Una o más actividades registradas en el calendario{' '} <strong>ya no se recomiendan</strong> debido a las condiciones climáticas actuales. </Alert> </Box> )}
      
      <Box sx={{ position: 'fixed', top: '60px', right: '100px', width: '90vw', maxWidth: 700, height: 600, backgroundColor: 'rgba(0,0,0,0.7)', padding: 2, borderRadius: 2, fontFamily: "'Roboto', sans-serif", boxShadow: 3, }}> 
       <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>🌆 Buscar una ciudad</Typography>
       <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}> <TextField label="Ingresa la ciudad" variant="outlined" size="small" fullWidth value={inputCity} onChange={(e) => setInputCity(e.target.value)} placeholder="Ej: Madrid" sx={{ input: { color: 'white' }, '& label': { color: 'white' }, }} InputProps={{ endAdornment: ( <Button type="submit" sx={{ minWidth: 0, padding: '6px', color: 'white' }}> <SearchIcon /> </Button> ), }} /> </form>
       <Typography variant="h5" align="center" component="h2" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'bold'}}>☀️ Tiempo de hoy</Typography>
       {submitted && ( <> <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}> <Card sx={{width: '200px', height: '130px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', p: 2, color: 'white', }} elevation={4}> <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{ciudad}</Typography> <Box display="flex" alignItems="center" gap={0}> <Typography variant="h3" sx={{ fontWeight: 'bold' }}> {temperature}<span style={{ verticalAlign: 'super', fontSize: '22px' }}>°C</span></Typography> {icono && ( <Box component="img" src={`https://openweathermap.org/img/wn/${icono}@2x.png`} alt={weather} sx={{ width: 80, height: 80 }} /> )} </Box> <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', "&::first-letter": {textTransform: "uppercase"}}}>{estadoClimatico}</Typography> </Card> <Card sx={{width: '250px', height: '130px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', padding: '16px', color: 'white' }} elevation={4}> <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Detalles del clima</Typography> <Typography variant="body1" sx={{ fontWeight: 'bold' }}>💧 Humedad: {humedad}%</Typography> <Typography variant="body1" sx={{ fontWeight: 'bold' }}>☁️ Nubosidad: {nubosidad}%</Typography> <Typography variant="body1" sx={{ fontWeight: 'bold' }}>💨 Viento: {viento} m/s</Typography> </Card> </Stack> <Typography variant="h6" align="center" sx={{ mb: 2, color: 'white', fontWeight: 'bold'}}>🔮 Pronóstico diario</Typography> <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> <Button variant="contained" size="small" onClick={handleAnterior} disabled={indiceInicio === 0} sx={{ minWidth: 32, height: 32, fontSize: '18px', borderRadius: '50%', padding: 0, }}>{'<'}</Button> <Box sx={{ minWidth: 220, width: '100%' }}> <Typography variant="subtitle1" align="center" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}> {(() => { const fecha = diasPronostico[indiceInicio]; const fechaFormateada = new Date(fecha + 'T00:00:00').toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', }); const temps = forecast[fecha] || []; const minTemp = temps.length > 0 ? Math.min(...temps.map(item => item.main.temp_min)).toFixed(1) : null; const maxTemp = temps.length > 0 ? Math.max(...temps.map(item => item.main.temp_max)).toFixed(1) : null; return `${fechaFormateada}${minTemp && maxTemp ? `  (🌡️ Mín: ${minTemp}°C / Máx: ${maxTemp}°C)` : ''}`; })()} </Typography> <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}> {(forecast[diasPronostico[indiceInicio]] || []).map(renderPronosticoHorario)} </Stack> </Box> <Button variant="contained" size="small" onClick={handleSiguiente} disabled={indiceInicio === diasPronostico.length - 1} sx={{ minWidth: 32, height: 32, fontSize: '18px', borderRadius: '50%', padding: 0, }}>{'>'}</Button> </Box> </> )}
      </Box>

      <PanelActividades
        favoriteActivities={favoriteActivities}
        scheduledActivities={scheduledActivities}
        allActivities={allActivities}
        forecast={forecast}
        fechaHoy={fechaHoy}
        ciudad={ciudad}
        traducirMainClima={traducirMainClima}
        loading={loadingActivities}
      />
    </>
  );
}

export default WeatherStart;

