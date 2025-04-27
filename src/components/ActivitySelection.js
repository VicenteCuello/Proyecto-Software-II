import React, { useState } from 'react'; //para guardar estados->actividades seleccionadas
import { useParams, useNavigate } from 'react-router-dom'; //useParams: Capturar parametros de la URL  |useNavigate: Navegar a otra ruta dentro de la app
import Button from '@mui/material/Button'; //button de MUI

function ActivitySelection() {
  const { date } = useParams(); // Capturar la fecha de la URL
  const navigate = useNavigate(); //moverse a otra pagina, quizas al calendario de vuelta
  const [activities, setActivities] = useState([]); //estado que guarda un array de las actividades seleccionadas

  const availableActivities = ['Yoga', 'Correr', 'Leer', 'Estudiar React']; //array con opciones a elegir 

  const toggleActivity = (activity) => { //funcion toggleActivity
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSave = () => {
    console.log(`Actividades registradas para ${date}:`, activities);
    navigate('/'); // Volver al calendario
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Seleccionar actividades para {date}</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {availableActivities.map((activity) => (
          <li key={activity}>
            <label>
              <input
                type="checkbox"
                checked={activities.includes(activity)}
                onChange={() => toggleActivity(activity)}
              />
              {activity}
            </label>
          </li>
        ))}
      </ul>
      {/*<button onClick={handleSave} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Guardar y volver
      </button>*/}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSave} 
        style={{ marginTop: '20px' }}
      >
        Guardar y volver
      </Button>
    </div>
  );
}

export default ActivitySelection;
