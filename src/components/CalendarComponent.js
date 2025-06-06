// Importa los módulos necesarios de React y React Router
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Componente para mostrar el calendario
import { useNavigate } from 'react-router-dom'; // Hook para la navegación entre páginas
import 'react-calendar/dist/Calendar.css'; // Estilos predeterminados de react-calendar
import './CalendarStyles.css'; // Estilos personalizados para el calendario

// Componente principal que representa el calendario
function CalendarComponent() {
  // Estado para manejar la fecha seleccionada y las actividades asociadas a esa fecha
  const [date, setDate] = useState(new Date());
  const [activitiesByDate, setActivitiesByDate] = useState({}); // Guardamos las actividades por fecha
  const navigate = useNavigate(); // Hook para navegación

  // useEffect para cargar las actividades guardadas desde localStorage cuando el componente se monta
  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {}; // Si no hay datos, usamos un objeto vacío
    setActivitiesByDate(savedActivities); // Actualiza el estado con las actividades guardadas
  }, []);

  // Función para manejar el cambio de fecha en el calendario
  const handleDateChange = (newDate) => {
    setDate(newDate); // Actualiza la fecha seleccionada
    const formattedDate = newDate.toISOString().split('T')[0]; // Convierte la fecha al formato YYYY-MM-DD
    navigate(`/select-activities/${formattedDate}`); // Navega a la ruta correspondiente
  };

  // Función para mostrar un indicador si un día tiene actividades programadas
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null; // Solo mostrar contenido en la vista de mes
    const formattedDate = date.toISOString().split('T')[0]; // Formatea la fecha a YYYY-MM-DD
    const hasActivities = activitiesByDate[formattedDate] && activitiesByDate[formattedDate].length > 0; // Verifica si hay actividades en esa fecha
    return hasActivities ? (
      <div className="activity-indicator" /> // Muestra un indicador si hay actividades
    ) : null;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', // Centra el calendario verticalmente
        height: '100vh', 
        backgroundColor: '#07498d', // Color de fondo
      }}
    >
      <h1 className="titulo-calendario">Selecciona una fecha para agendar</h1>
      <div style={{ zIndex: 10 }}>
        <Calendar
          onChange={handleDateChange} // Asocia la función handleDateChange al cambiar la fecha
          value={date} // Establece la fecha seleccionada
          tileContent={tileContent} // Añade el contenido a cada celda del calendario
        />
      </div>
    </div>
  );
}

export default CalendarComponent; // Exporta el componente CalendarComponent
