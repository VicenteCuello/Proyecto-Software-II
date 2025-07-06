import React, { useState, useEffect, useContext } from 'react'; // Se añade useContext
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';
import { CityContext } from './CityContext'; // Se importa el Context

// --- Funciones auxiliares  ---
async function getForecastByCity(city) {
  // Asumiendo que la API Key está en variables de entorno
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=es`
  );
  if (!response.ok) {
    throw new Error('Error al obtener el pronóstico del clima');
  }
  return await response.json();
}

function agruparForecastPorDia(list) {
  return list.reduce((acc, item) => {
    const date = item.dt_txt.split(' ')[0]; // 'YYYY-MM-DD'
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
}

const traducirMainClima = (main) => {
  const traducciones = {
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
  return traducciones[main] || main.toLowerCase();
};

// --- Componente principal ---
function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [activitiesByDate, setActivitiesByDate] = useState({});
  const [forecasts, setForecasts] = useState({});
  const [activities, setActivities] = useState([]);
  
  // Se obtiene la función para actualizar la alerta del contexto
  const { setHasCalendarAlert } = useContext(CityContext);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const forecastCache = {};
        const dates = Object.keys(activitiesByDate);

        for (const date of dates) {
          const dayActivities = activitiesByDate[date];
          if (!dayActivities || dayActivities.length === 0) continue;

          // Asumimos misma ciudad para todas las actividades de ese día
          const location = dayActivities[0].location; 
          if (!location) continue;

          try {
            const forecastData = await getForecastByCity(location);
            const grouped = agruparForecastPorDia(forecastData.list);
            forecastCache[date] = grouped[date] || [];
          } catch (error) {
            console.error(`No se pudo obtener el pronóstico para ${location} en ${date}.`, error);
            forecastCache[date] = [];
          }
        }
        setForecasts(forecastCache);
      } catch (error) {
        console.error('Error general al cargar forecasts:', error);
      }
    };

    if (Object.keys(activitiesByDate).length > 0) {
      fetchForecasts();
    }
  }, [activitiesByDate]);

  useEffect(() => {
    const fetchScheduledActivities = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/schedule`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        const map = {};
        data.forEach(item => {
          const d = new Date(item.scheduled_date).toISOString().split('T')[0];
          if (!map[d]) {
            map[d] = [];
          }
          map[d].push(item);
        });
        setActivitiesByDate(map);
      } catch (error) {
        console.error('Error al obtener actividades agendadas:', error);
      }
    };
    fetchScheduledActivities();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/activities`);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error al cargar actividades:', error);
      }
    };
    fetchActivities();
  }, []);
  
  // --- NUEVO USEEFFECT PARA MANEJAR LA ALERTA ---
  useEffect(() => {
    // Evitar ejecuciones prematuras antes de tener todos los datos necesarios
    if (Object.keys(activitiesByDate).length === 0 || activities.length === 0) {
      return;
    }

    let redDayFound = false;

    // Iterar sobre cada día que tiene actividades agendadas
    for (const dateKey in activitiesByDate) {
      const dayData = activitiesByDate[dateKey]; // Actividades del día
      const forecastForDay = forecasts[dateKey]; // Pronóstico del día

      // Si no hay pronóstico para un día con actividades, no podemos saber el estado
      if (!forecastForDay || forecastForDay.length === 0) {
        continue;
      }
      
      const temps = forecastForDay.map(item => item.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      const weatherStates = [...new Set(forecastForDay.map(item => traducirMainClima(item.weather[0].main)))];
      
      let allPossible = true;
      for (const activityItem of dayData) {
        // Encontrar los detalles de la actividad (temperatura, estados) en la lista maestra
        const activityDetails = activities.find(a => a.name === activityItem.name);
        if (activityDetails) {
          const tempOk = minTemp >= activityDetails.temperatura[0] && maxTemp <= activityDetails.temperatura[1];
          const weatherOk = activityDetails.estado.some(e => weatherStates.includes(e));
          
          if (!tempOk || !weatherOk) {
            allPossible = false;
            break; // Si una actividad no es viable, el día es "rojo"
          }
        }
      }

      if (!allPossible) {
        redDayFound = true;
        break; // Si ya encontramos un día rojo, no hace falta seguir buscando
      }
    }
    
    // Actualizar el estado global de la alerta
    setHasCalendarAlert(redDayFound);

  }, [activitiesByDate, forecasts, activities, setHasCalendarAlert]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0];
    window.location.href = `/select-activities/${formattedDate}`;
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const formattedDate = date.toISOString().split('T')[0];
    return activitiesByDate[formattedDate] ? (
      <div className="activity-indicator"></div>
    ) : null;
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const formattedDate = date.toISOString().split('T')[0];
    const dayData = activitiesByDate[formattedDate];

    if (!dayData || dayData.length === 0) {
      return null;
    }

    const forecastForDay = forecasts[formattedDate];

    if (!forecastForDay || forecastForDay.length === 0) {
      return 'day-gray'; // Día gris si no hay pronóstico
    }

    const temps = forecastForDay.map(item => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const weatherStates = [...new Set(forecastForDay.map(item => traducirMainClima(item.weather[0].main)))];

    let allPossible = true;
    for (const activityItem of dayData) {
      // Usamos la lista de actividades del estado del componente
      const activity = activities.find(a => a.name === activityItem.name);
      if (activity) {
        const tempOk = minTemp >= activity.temperatura[0] && maxTemp <= activity.temperatura[1];
        const weatherOk = activity.estado.some(e => weatherStates.includes(e));
        if (!tempOk || !weatherOk) {
          allPossible = false;
          break;
        }
      }
    }

    return allPossible ? 'day-green' : 'day-red';
  };

  return (
    <div style={{ padding: '40px', background: '#07498d', height: '100vh' }}>
      <h1 className="titulo-calendario">Calendario</h1>
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
    </div>
  );
}

export default CalendarComponent;
