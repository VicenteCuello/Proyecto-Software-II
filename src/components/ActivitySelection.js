import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Snackbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Box, 
  TextField,
  CircularProgress,
  IconButton 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Search, MyLocation } from '@mui/icons-material';
import { getWeatherByCity, getForecastByCity, getWeatherByCoords } from '../api/weather';
import { availableActivities } from '../components/activities';

const groupForecastByDay = (list) => {
  return list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
};

const translateWeatherMain = (main) => {
  const translations = {
    Thunderstorm: 'tormenta',
    Drizzle: 'lluvioso',
    Rain: 'lluvioso',
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
  return translations[main] || main.toLowerCase();
};

function ActivitySelection() {
  const { date } = useParams();
  const navigate = useNavigate();
  
  // Estados del componente
  const [cityInput, setCityInput] = useState('');
  const [currentCity, setCurrentCity] = useState('Concepción');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [activities, setActivities] = useState([]);

  // Cargar actividades y ubicación guardadas
useEffect(() => {
  const fetchScheduledActivities = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/schedule?date=${date}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedActivities(data.map(item => item.name));
      if (data.length > 0 && data[0].location) {
        setCurrentCity(data[0].location);
        setCityInput(data[0].location);
        fetchWeather(data[0].location);
      } else {
        fetchWeather(currentCity);
      }
    } catch (err) {
      console.error(err);
      fetchWeather(currentCity);
    }
  };

  fetchScheduledActivities();
}, [date]);

useEffect(() => {
  const fetchActivities = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/activities`);
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Error al cargar actividades:', err);
    }
  };
  fetchActivities();
}, []);

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getForecastByCity(city);
      setForecast(groupForecastByDay(data.list));
      setCurrentCity(city);
    } catch (err) {
      console.error("Error al obtener pronóstico:", err);
      setError(`No se pudo obtener el clima para ${city}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async () => {
    try {
      setGeoLoading(true);
      setError(null);
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const data = await getWeatherByCoords(
        position.coords.latitude, 
        position.coords.longitude
      );
      
      setForecast(groupForecastByDay(data.list));
      setCurrentCity(data.city.name);
      setCityInput(data.city.name);
    } catch (err) {
      console.error("Error en geolocalización:", err);
      setError("No se pudo obtener tu ubicación");
    } finally {
      setGeoLoading(false);
    }
  };

  const checkActivityViability = (activity) => {
    const dayForecast = forecast?.[date];
    if (!dayForecast || !Array.isArray(dayForecast) || dayForecast.length === 0) {
        return 'gray'; // Clima no disponible para el día, devuelve 'gray' seguro
    }

    const temps = dayForecast.map(item => item.main.temp).filter(temp => typeof temp === 'number');

    if (temps.length === 0) {
        return 'gray'; // No hay temperaturas válidas
    }

    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const weatherConditions = [...new Set(
        dayForecast.map(item => item.weather?.[0]?.main ? translateWeatherMain(item.weather[0].main) : null)
    )].filter(Boolean);

    const isTempOK = minTemp >= activity.temperatura[0] && maxTemp <= activity.temperatura[1];
    const isWeatherOK = activity.estado.some(condition => weatherConditions.includes(condition));

    return isTempOK && isWeatherOK ? 'green' : 'red';
  };



  const toggleActivity = (activityName) => {
    setSelectedActivities(prev => 
      prev.includes(activityName)
        ? prev.filter(name => name !== activityName)
        : [...prev, activityName]
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Mapear nombres seleccionados a IDs
      const activityIds = activities
        .filter(a => selectedActivities.includes(a.name))
        .map(a => a.id);


      await fetch(`${process.env.REACT_APP_API_URL}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: date, // 'YYYY-MM-DD'
          activityIds: activityIds,
          location: currentCity
        })
      });
      console.log('Enviando al backend:', {
        date,
        activityIds,
      location: currentCity
      });
      setOpenSnackbar(true);
      setTimeout(() => navigate('/calendar'), 1000);
    } catch (err) {
      console.error(err);
      alert('Error al guardar actividades.');
    }
  };


  const handleSearch = () => {
    if (cityInput.trim()) {
      fetchWeather(cityInput.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getActivityStyle = (activity) => {
    const status = checkActivityViability(activity);
    const isSelected = selectedActivities.includes(activity.name);

    const baseStyles = {
      padding: '10px 20px',
      marginBottom: '8px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }
    };

    const statusStyles = {
      green: {
        backgroundColor: isSelected ? '#4d774d' : '#6fa96f',
        '&:hover': { backgroundColor: '#5e8c5e' }
      },
      red: {
        backgroundColor: isSelected ? '#a84a4a' : '#cc7070',
        '&:hover': { backgroundColor: '#bb5d5d' }
      },
      gray: {
        backgroundColor: isSelected ? '#686868' : '#979797',
        '&:hover': { backgroundColor: '#7f7f7f' }
      }
    };

    return { ...baseStyles, ...statusStyles[status] };
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#5767d0'
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: 3, 
      backgroundColor: '#5767d0',
      minHeight: '100vh'
    }}>
      {/* Buscador de ciudad */}
      <Box sx={{ 
        maxWidth: 600,
        margin: '0 auto 30px',
        display: 'flex',
        gap: 2,
        alignItems: 'center'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Buscar ciudad..."
          sx={{
            input: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.7)' }
            }
          }}
          InputProps={{
            startAdornment: (
              <Search sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />
            ),
          }}
        />
        
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!cityInput.trim()}
          sx={{
            minWidth: 100,
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
          }}
        >
          Buscar
        </Button>
        
        <IconButton
          onClick={fetchWeatherByCoords}
          disabled={geoLoading}
          sx={{
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
          }}
        >
          {geoLoading ? <CircularProgress size={24} /> : <MyLocation />}
        </IconButton>
      </Box>

      {error && (
        <Box sx={{
          backgroundColor: 'rgba(198, 40, 40, 0.2)',
          color: '#ffcdd2',
          padding: 2,
          borderRadius: 1,
          margin: '0 auto 20px',
          maxWidth: 600,
          textAlign: 'center'
        }}>
          {error}
        </Box>
      )}

      <Typography variant="h4" align="center" sx={{ 
        color: 'white', 
        mb: 3,
        fontWeight: 'bold'
      }}>
        Actividades para {date} en {currentCity}
      </Typography>

      <Box sx={{ 
        maxWidth: 600, 
        mx: 'auto',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        p: 3,
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }}>
        <List>
          {activities.map((activity) => {
            const viability = checkActivityViability(activity);
            const isSelected = selectedActivities.includes(activity.name);

            return (
              <ListItem
                key={activity.name}
                onClick={() => toggleActivity(activity.name)}
                sx={getActivityStyle(activity)}
              >

                <ListItemIcon>
                  <img 
                    src={activity.image} 
                    alt={activity.name}
                    style={{ 
                      width: 50, 
                      height: 50,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'white' : 'transparent'}`,
                      objectFit: 'cover'
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ 
                      color: 'white',
                      fontWeight: 'medium',
                      fontSize: '1.1rem',
                      textDecoration: viability === 'red' ? 'line-through' : 'none'
                    }}>
                      {activity.name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: 'rgba(245,245,245,0.7)' }}>
                      {activity.temperatura[0]}°C - {activity.temperatura[1]}°C | {activity.estado.join(', ')}
                    </Typography>
                  }
                />
                {isSelected && <CheckCircle sx={{ color: '#f0f0f0' }} />}
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mt: 4 
        }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: '#232b60',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#1a203d'
              }
            }}
          >
            Guardar y volver
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(true)}
            sx={{
              px: 4,
              py: 1.5
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        message={`Actividades y ubicación guardadas para ${date}`}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas cancelar? Los cambios no se guardarán.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Continuar editando</Button>
          <Button 
            onClick={() => navigate('/calendar')} 
            color="error"
          >
            Salir sin guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ActivitySelection;