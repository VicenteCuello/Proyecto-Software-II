import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

async function getForecastByCity(city) {
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

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [activitiesByDate, setActivitiesByDate] = useState({});
  const [forecasts, setForecasts] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const forecastCache = {};

        const dates = Object.keys(activitiesByDate);

        for (const date of dates) {
          const dayActivities = activitiesByDate[date];
          if (!dayActivities || dayActivities.length === 0) continue;

          const location = dayActivities[0].location; // Asumimos misma ciudad para todas las actividades de ese día
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
        console.log('Forecasts cargados:', forecastCache);
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
        console.log('Intentando fetch /api/schedule con token:', token);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/schedule`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Response fetch /api/schedule:', response);
        const data = await response.json();
        console.log('Data fetch /api/schedule:', data);

        // procesamiento...
        const map = {};
        data.forEach(item => {
          const d = new Date(item.scheduled_date).toISOString().split('T')[0]; // normaliza a 'YYYY-MM-DD'
          if (!map[d]) {
            map[d] = [];
          }
          map[d].push(item);
        });
        setActivitiesByDate(map);
        console.log('activitiesByDate actualizado:', map);

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


  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0];
    window.location.href = `/select-activities/${formattedDate}`;
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const formattedDate = date.toISOString().split('T')[0];
    console.log('activitiesByDate:', activitiesByDate);
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
      return 'day-gray';
    }

    const temps = forecastForDay.map(item => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const weatherStates = [...new Set(forecastForDay.map(item => traducirMainClima(item.weather[0].main)))];

    let allPossible = true;
    for (const activityItem of dayData) {
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
