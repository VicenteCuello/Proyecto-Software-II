import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';
import { getForecastByCity } from '../api/weather';
import { availableActivities } from './activities';
import { CityContext } from './CityContext';

// Agrupa forecast por día (YYYY-MM-DD)
const agruparForecastPorDia = (lista) => {
  return lista.reduce((acc, item) => {
    const fecha = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(item);
    return acc;
  }, {});
};

// Traducción del clima
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

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [activitiesByDate, setActivitiesByDate] = useState({});
  const [forecasts, setForecasts] = useState({});
  const navigate = useNavigate();
  const { setHasCalendarAlert } = useContext(CityContext);

  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesData')) || {};
    setActivitiesByDate(savedActivities);

    const fetchForecasts = async () => {
      const forecastCache = {};
      const fetchPromises = Object.entries(savedActivities).map(async ([fecha, data]) => {
        const location = data.location;
        if (!location) return;

        try {
          const forecastData = await getForecastByCity(location);
          const grouped = agruparForecastPorDia(forecastData.list);
          forecastCache[fecha] = grouped[fecha] || [];
        } catch (error) {
          console.error(`No se pudo obtener el pronóstico para ${location} en ${fecha}.`, error);
          forecastCache[fecha] = [];
        }
      });

      await Promise.all(fetchPromises);
      setForecasts(forecastCache);
    };

    fetchForecasts();
  }, []);

  // Nuevo useEffect para verificar y establecer la alerta
  useEffect(() => {
    let redDayFound = false;

    // Iterar sobre las fechas con actividades guardadas
    for (const dateKey in activitiesByDate) {
      const dayData = activitiesByDate[dateKey];
      const forecastForDay = forecasts[dateKey];

      // Si no hay datos de actividad o pronóstico, continuar
      if (!dayData?.activities?.length || !forecastForDay?.length) {
        continue;
      }
      
      const temps = forecastForDay.map(item => item.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      const weatherStates = [...new Set(forecastForDay.map(item => traducirMainClima(item.weather[0].main)))];

      let allPossible = true;
      for (const activityName of dayData.activities) {
        const activity = availableActivities.find(a => a.name === activityName);
        if (activity) {
          const tempOk = minTemp >= activity.temperatura[0] && maxTemp <= activity.temperatura[1];
          const weatherOk = activity.estado.some(e => weatherStates.includes(e));
          if (!tempOk || !weatherOk) {
            allPossible = false;
            break; 
          }
        }
      }

      if (!allPossible) {
        redDayFound = true;
        break; // Si encontramos un día rojo, no necesitamos seguir buscando
      }
    }
    
    setHasCalendarAlert(redDayFound);

  }, [activitiesByDate, forecasts, setHasCalendarAlert]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0];
    navigate(`/select-activities/${formattedDate}`);
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const formattedDate = date.toISOString().split('T')[0];
    const dayData = activitiesByDate[formattedDate];

    if (!dayData || !dayData.activities || dayData.activities.length === 0) {
      return null;
    }

    const forecastForDay = forecasts[formattedDate];

    if (!forecastForDay || forecastForDay.length === 0) {
      return 'day-gray';
    }

    const temps = forecastForDay.map(item => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const weatherStates = [...new Set(forecastForDay.map(item => traducirMainClima(item.weather[0].main)))];

    let allPossible = true;
    for (const activityName of dayData.activities) {
      const activity = availableActivities.find(a => a.name === activityName);
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

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const formattedDate = date.toISOString().split('T')[0];
    const hasActivities = activitiesByDate[formattedDate]?.activities?.length > 0;
    return hasActivities ? <div className="activity-indicator" /> : null;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#07498d',
      }}
    >
      <h1 className="titulo-calendario">Selecciona una fecha para agendar</h1>
      <div style={{ zIndex: 10 }}>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
        />
      </div>
    </div>
  );
}

export default CalendarComponent;
