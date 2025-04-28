import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ActivitySelection() {
  const { date } = useParams(); // Capturar la fecha de la URL
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  const availableActivities = ['Yoga', 'Correr', 'Leer', 'Estudiar React'];

  const toggleActivity = (activity) => {
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
      <button onClick={handleSave} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Guardar y volver
      </button>
    </div>
  );
}

export default ActivitySelection;
