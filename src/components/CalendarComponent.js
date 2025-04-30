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
        justifyContent: 'center',
        alignItems: 'center', // Centra el calendario verticalmente
        height: '100vh', // Hace que el div ocupe toda la altura de la ventana
        backgroundImage: 'url(/images/fondo2.png)', // Ruta relativa a la imagen en public/images
        backgroundSize: 'cover', // Cubre toda la ventana con la imagen
        backgroundPosition: 'center', // Centra la imagen de fondo
        backgroundAttachment: 'fixed', // Fija la imagen al fondo mientras se desplaza
      }}
    >
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
/*
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
    </div>
  );
}

export default CalendarComponent;
*/