// src/components/CalendarComponent.js

import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';
import { getForecastByCity } from '../api/weather'; 
import { availableActivities } from './activities'; 
import { CityContext } from './CityContext';

// Función para agrupar el pronóstico por día. 
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

// Función para traducir el estado del clima principal.
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
  const [forecast, setForecast] = useState({});
  // LEER LA CIUDAD DESDE EL CONTEXTO GLOBAL
  const { city } = useContext(CityContext); 
  const navigate = useNavigate();

  // Cargar actividades guardadas y el pronóstico del tiempo al iniciar
  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    setActivitiesByDate(savedActivities);

    const fetchWeather = async () => {
      if (!city) return; // No hacer nada si no hay ciudad
      try {
        const forecastData = await getForecastByCity(city);
        const groupedForecast = agruparForecastPorDia(forecastData.list);
        setForecast(groupedForecast);
      } catch (error) {
        console.error(`No se pudo obtener el pronóstico para ${city}.`, error);
        setForecast({}); // Limpiar el pronóstico si falla
      }
    };

    fetchWeather();
  }, [city]); // El efecto se ejecuta si la ciudad cambia

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0];
    navigate(`/select-activities/${formattedDate}`);
  };

  // Lógica para asignar clases CSS a cada día del calendario
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') {
      return null;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const activitiesForDay = activitiesByDate[formattedDate];

    // Si no hay actividades para este día, no se aplica ninguna clase.
    if (!activitiesForDay || activitiesForDay.length === 0) {
      return null;
    }

    const forecastForDay = forecast[formattedDate];

    // Gris: Hay actividades pero no hay pronóstico disponible para ese día.
    if (!forecastForDay) {
      return 'day-gray';
    }

    const dailyTemps = forecastForDay.map(item => item.main.temp);
    const minTemp = Math.min(...dailyTemps);
    const maxTemp = Math.max(...dailyTemps);
    // Obtener todos los estados del clima únicos para el día.
    const weatherStates = [...new Set(forecastForDay.map(item => traducirMainClima(item.weather[0].main).toLowerCase()))];

    let allActivitiesPossible = true;

    for (const activityName of activitiesForDay) {
      const activity = availableActivities.find(a => a.name === activityName);

      if (activity) {
        const tempOk = minTemp >= activity.temperatura[0] && maxTemp <= activity.temperatura[1];
        const weatherOk = activity.estado.some(e => weatherStates.includes(e));

        // Si una sola actividad no es compatible, el día se marca en rojo.
        if (!tempOk || !weatherOk) {
          allActivitiesPossible = false;
          break;
        }
      }
    }

    // Verde si todas son posibles, Rojo si al menos una no lo es.
    return allActivitiesPossible ? 'day-green' : 'day-red';
  };
  
  // Muestra un indicador si hay actividades (punto debajo de la fecha)
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const formattedDate = date.toISOString().split('T')[0];
    const hasActivities = activitiesByDate[formattedDate] && activitiesByDate[formattedDate].length > 0;
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
          tileClassName={tileClassName} // Aquí se aplica la lógica de coloreado
        />
      </div>
    </div>
  );
}

export default CalendarComponent;
