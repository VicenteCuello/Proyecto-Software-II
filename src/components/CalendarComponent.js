import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [activitiesByDate, setActivitiesByDate] = useState({}); //NUEVO
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar las actividades guardadas al montar el componente
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    setActivitiesByDate(savedActivities);
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    navigate(`/select-activities/${formattedDate}`);
  };

  // Función para determinar si una fecha tiene actividades
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const formattedDate = date.toISOString().split('T')[0];
    const hasActivities = activitiesByDate[formattedDate] && activitiesByDate[formattedDate].length > 0;
    
    return hasActivities ? (
      <div className="activity-indicator" />
    ) : null;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent:  'center',
        alignItems: 'center', // Centra el calendario verticalmente
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
        />
      </div>
    </div>
  );
}

export default CalendarComponent;
