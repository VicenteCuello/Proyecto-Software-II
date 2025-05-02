import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    navigate(`/select-activities/${formattedDate}`);
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
        />
      </div>
    </div>
  );
}

export default CalendarComponent;
