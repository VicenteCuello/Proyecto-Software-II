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
import { getWeatherByCity, getForecastByCity, getWeatherByCoords } from '../api/weather'; //llamadas a la API
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

  // Cargar actividades guardadas
  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    setSelectedActivities(savedActivities[date] || []);
  }, [date]);

  // Buscar ciudad inicial al cargar
  useEffect(() => {
    fetchWeather(currentCity);
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
      
      // Cambiado a getWeatherByCoords que es la función disponible en tu API
      const data = await getWeatherByCoords(
        position.coords.latitude, 
        position.coords.longitude
      );
      
      // Asegúrate que la respuesta de getWeatherByCoords tenga la misma estructura que getForecastByCity
      // Si es necesario, puedes adaptar esta parte según la estructura real de tu API
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

  const getWeatherByCoords = async () => {
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
    if (!forecast || !forecast[date]) return 'gray';
    
    const dayForecast = forecast[date];
    const temps = dayForecast.map(item => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    const weatherConditions = [...new Set(
      dayForecast.map(item => translateWeatherMain(item.weather[0].main))
    )];

    const isTempOK = minTemp >= activity.temperatura[0] && maxTemp <= activity.temperatura[1];
    const isWeatherOK = activity.estado.some(condition => 
      weatherConditions.includes(condition)
    );

    return isTempOK && isWeatherOK ? 'green' : 'red';
  };

  const toggleActivity = (activityName) => {
    setSelectedActivities(prev => 
      prev.includes(activityName)
        ? prev.filter(name => name !== activityName)
        : [...prev, activityName]
    );
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    saved[date] = selectedActivities;
    localStorage.setItem('activitiesByDate', JSON.stringify(saved));
    setOpenSnackbar(true);
    setTimeout(() => navigate('/calendar'), 1000);
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
          {availableActivities.map((activity) => {
            const viability = checkActivityViability(activity);
            const isSelected = selectedActivities.includes(activity.name);

            return (
              <ListItem
                key={activity.name}
                button
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
        message="Actividades guardadas correctamente"
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