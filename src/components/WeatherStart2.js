import React, { useState, useEffect, useCallback, useContext } from 'react'; //maejar variables, ejecutar código, memorizar funciones
import { getWeatherByCity, getForecastByCity, getWeatherByCoords } from '../api/weather'; //llamadas a la API
import { availableActivities } from '../components/activities';
import { CityContext } from './CityContext';
import SearchIcon from '@mui/icons-material/Search';

import {
  Box, //contenedor
  TextField, //campo de texto
  Button, //boton
  Typography, //texto con estilos
  Card, //tarjeta con bordes y sombra
  Stack, //organizar algo horizontal o verticalmente
} from '@mui/material';

//actualizar estados del componente (estado actual, funcion para actualizar estado = valor de inicio)
function WeatherStart2() {
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
  const { setCity: setGlobalCity } = useContext(CityContext);
  const [diaVisibleIndex, setDiaVisibleIndex] = useState(0);
  //nuevas 2 lineas
  const [forecastCardIndex, setForecastCardIndex] = useState(0);
  const CARDS_PER_VIEW = 4;

  const traducirMainClima = (main) => {
    const traducciones = {
      Thunderstorm: 'Tormenta', Drizzle: 'lluvioso', Rain: 'lluvioso', Snow: 'Nieve',
      Clear: 'Soleado', Clouds: 'Nublado', Mist: 'Niebla', Smoke: 'Niebla', Haze: 'Niebla',
      Dust: 'Niebla', Fog: 'Niebla', Sand: 'Niebla', Ash: 'Niebla', Squall: 'Viento',Tornado: 'Tormenta',
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
          minWidth: 110,
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
        <Typography variant="body2">{hora}</Typography>
        <Box component="img"
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt={item.weather[0].description}
            sx={{ width: 40, height: 40 }}
        />
        <Box display="flex" flexDirection="column">
          <Typography variant="caption" display="block" gutterBottom  sx={{"&::first-letter": {textTransform: "uppercase"}}}>
            {clima}
          </Typography>
          <Typography variant="caption">🌡️ {temp}°C</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#FFFF' }}>
          🌧️ {lluvia}%  
        </Typography>
        <Typography variant="caption" sx={{ color: '#FFFF', marginLeft: '2px' }}>
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
  const diasCompletos = [fechaHoy, ...pronosticoSiguientesDias];
  const diaActual = diasCompletos[diaVisibleIndex];
  const datosDiaActual = forecast[diaActual] || [];
  const minTempDiaActual = datosDiaActual.length > 0 ? Math.min(...datosDiaActual.map(item => item.main.temp_min)).toFixed(1) : null;
  const maxTempDiaActual = datosDiaActual.length > 0 ? Math.max(...datosDiaActual.map(item => item.main.temp_max)).toFixed(1) : null;
  //nueva 1 linea
  const cardsVisibles = datosDiaActual.slice(forecastCardIndex, forecastCardIndex + CARDS_PER_VIEW);

  //mostrar clima  
  return (
    <Box
      sx={{
        position: 'absolute',   // o 'fixed' si no quieres que se mueva al hacer scroll
        top: '60px',            // distancia desde el borde superior
        right: '55px',          // distancia desde el borde derecho
        width: '90vw',
        maxWidth: 700,
        //backgroundImage: 'url(/images/clima.jpg)',
        //backgroundSize: 'cover',
        //backgroundPosition: 'center',
        //backgroundRepeat: 'no-repeat',
        bgcolor: 'rgba(0,0,0,0.5)',
        padding: 2,
        borderRadius: 2,
        fontFamily: "'Roboto', sans-serif",
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, color: 'white' }}>
        Buscar una ciudad
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

      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, color: 'white' }}>
        Tiempo de hoy
      </Typography>
      {/*mostrar card con el clima actual */}
      {submitted && (
        <>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            {/* temperatura y estado climático del día actual */}
            <Card sx={{width: '200px', height: '130px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', p: 2, color: 'white', }} elevation={4}>
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
            <Card sx={{width: '250px', height: '130px', backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', textAlign: 'center', padding: '16px', color: 'white' }} elevation={4}>
              <Typography variant="h6" gutterBottom>
                Detalles del clima
              </Typography>
              <Typography variant="body1">💧 Humedad: {humedad}%</Typography>
              <Typography variant="body1">☁️ Nubosidad: {nubosidad}%</Typography>
              <Typography variant="body1">💨 Viento: {viento} m/s</Typography>
              {/*<Typography variant="body1">🌧️ Lluvia (última hora): {lluvia} mm</Typography>*/}
            </Card>

            {/* Card de actividades favoritas para hoy
            <Card sx={{
              width: '220px',
              height:'150px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(5px)',
              color: 'white',
              p: 2,
              display: 'flex',
              flexDirection: 'column'
            }} elevation={4}>  */}
              {/* Obtener actividades favoritas para hoy 
              {(() => {
                const temps = pronosticoHoy;
                const minTemp = temps.length > 0 ? Math.min(...temps.map(item => item.main.temp_min)) : 0;
                const maxTemp = temps.length > 0 ? Math.max(...temps.map(item => item.main.temp_max)) : 0;
                const estadosDelDia = temps.map(item => traducirMainClima(item.weather[0].main).toLowerCase());
                
                const activitiesData = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
                const favoritosGuardados = activitiesData.undefined || [];
                const actividadesFavoritas = availableActivities.filter(act =>
                  favoritosGuardados.includes(act.name)
                );

                const actividadesFiltradas = actividadesFavoritas.filter(act => {
                  const tempOk = minTemp >= act.temperatura[0] && maxTemp <= act.temperatura[1];
                  const climaOk = act.estado.some(e => estadosDelDia.includes(e.toLowerCase()));
                  return tempOk && climaOk;
                });

                return (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>🌟</span> Actividades hoy
                    </Typography>
                    
                    {actividadesFiltradas.length > 0 ? (
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 1,
                        overflowY: 'auto',
                        maxHeight: '200px'
                      }}>
                        {actividadesFiltradas.map((act) => (
                          <Box key={act.name} sx={{ 
                            textAlign: 'center',
                            p: 0.5
                          }}>
                            <Box
                              component="img"
                              src={act.image}
                              alt={act.name}
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                mb: 0.5
                              }}
                            />
                            <Typography variant="caption" sx={{ 
                              color: 'white',
                              fontSize: '0.7rem',
                              display: 'block',
                              lineHeight: 1.1
                            }}>
                              {act.name}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        mt: 1
                      }}>
                        {pronosticoHoy.length > 0 
                          ? 'No hay actividades compatibles' 
                          : 'Esperando datos del clima...'}
                      </Typography>
                    )}
                  </>
                );
              })()}
            </Card>  */}
          </Stack>
          {/*cards para los siguientes días*/}
          <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
            Pronóstico diario y actividades
        </Typography>

        {/* Navegación */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Button
            disabled={diaVisibleIndex === 0}
            onClick={() => setDiaVisibleIndex(diaVisibleIndex - 1)}
            sx={{ color: 'white', fontSize: '1.5rem' }}
            >
             {'◀'}
            </Button>
            <Typography variant="subtitle1" sx={{ color: 'white' }}>
            {new Date(diaActual).toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })} {minTempDiaActual && maxTempDiaActual ? `(${minTempDiaActual}°C / ${maxTempDiaActual}°C)` : ''}
            </Typography>
            <Button
            disabled={diaVisibleIndex === diasCompletos.length - 1}
            onClick={() => setDiaVisibleIndex(diaVisibleIndex + 1)}
            sx={{ color: 'white', fontSize: '1.5rem' }}
            >
            {'▶'}
            </Button>
        </Box>

        {/* Pronóstico horario */}
        <Box display="flex" alignItems="center">
        <Button
            onClick={() => setForecastCardIndex(Math.max(forecastCardIndex - CARDS_PER_VIEW, 0))}
            disabled={forecastCardIndex === 0}
            sx={{
                color: 'white',
                fontSize: '1.5rem',
                minWidth: '40px',
                borderRadius: '50%',
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                },
            }}
            >
        {'<'}
        </Button>

        <Stack direction="row" spacing={1} sx={{ overflowX: 'hidden', width: '100%', justifyContent: 'center' }}>
          {cardsVisibles.length > 0 ? (
            cardsVisibles.map(renderPronosticoHorario)
          ) : (
            <Typography variant="body2" sx={{ color: 'white', px: 2 }}>
              No hay datos disponibles para este día.
            </Typography>
          )}
        </Stack>

        <Button
            onClick={() =>
                setForecastCardIndex((prev) =>
                prev + CARDS_PER_VIEW < datosDiaActual.length ? prev + CARDS_PER_VIEW : prev
                )
            }
            disabled={forecastCardIndex + CARDS_PER_VIEW >= datosDiaActual.length}
            sx={{
                color: 'white',
                fontSize: '1.5rem',
                minWidth: '40px',
                borderRadius: '50%',
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                },
            }}
            >
        {'>'}
        </Button>
        </Box>
        {/* Actividades recomendadas */}
        <Box sx={{
            mt: 2,
            p: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1
        }}>
            <Typography variant="subtitle2" sx={{
            color: 'white',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            }}>
            <span>🌟</span> Actividades recomendadas
            </Typography>
            {(() => {
            const temps = datosDiaActual;
            const minTemp = temps.length > 0 ? Math.min(...temps.map(item => item.main.temp_min)) : 0;
            const maxTemp = temps.length > 0 ? Math.max(...temps.map(item => item.main.temp_max)) : 0;
            const estadosDelDia = temps.map(item => traducirMainClima(item.weather[0].main).toLowerCase());

            const activitiesData = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
            const favoritosGuardados = activitiesData.undefined || [];
            const actividadesFavoritas = availableActivities.filter(act =>
                favoritosGuardados.includes(act.name)
            );

            const actividadesFiltradas = actividadesFavoritas.filter(act => {
                const tempOk = minTemp >= act.temperatura[0] && maxTemp <= act.temperatura[1];
                const climaOk = act.estado.some(e => estadosDelDia.includes(e.toLowerCase()));
                return tempOk && climaOk;
            });

            return actividadesFiltradas.length > 0 ? (
                <Stack direction="row" spacing={2} sx={{
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'left'
                }}>
                {actividadesFiltradas.map((act) => (
                    <Box key={act.name} sx={{
                    textAlign: 'center',
                    width: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                    }}>
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
                        mb: 0.5
                        }}
                    />
                    <Typography variant="caption" sx={{
                        color: 'white',
                        fontSize: '0.75rem',
                        lineHeight: 1.2,
                        display: 'block'
                    }}>
                        {act.name}
                    </Typography>
                    </Box>
                ))}
                </Stack>
            ) : (
                <Typography variant="body2" sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontStyle: 'italic',
                textAlign: 'center'
                }}>
                No hay actividades compatibles con el clima de este día
                </Typography>
            );
            })()}
        </Box>
        </Box>

        </>
      )}
    </Box>
  );
}
export default WeatherStart2;
