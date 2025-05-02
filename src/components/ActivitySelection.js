import React, { useState } from 'react';
import {
  Button, Snackbar, Typography, List, ListItem, ListItemIcon, ListItemText,
  Dialog, DialogActions, DialogContent, DialogTitle, Box
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import { useNotification } from './NotificationContext'; // ✅ Importación del contexto

function ActivitySelection() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // ✅ Hook para notificaciones

  const [activities, setActivities] = useState(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    return savedActivities[date] || [];
  });

  const [openDialog, setOpenDialog] = useState(false);

  const availableActivities = [
    { name: 'Yoga', image: '/images/yoga.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla']},
    { name: 'Correr', image: '/images/correr.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'viento', 'niebla'] },
    { name: 'Leer', image: '/images/leer.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Estudiar React', image: '/images/estudiar react.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Ir al cine', image: '/images/ir al cine.webp', temperatura: [18, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir al gym', image: '/images/ir al gym.webp', temperatura: [16, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp', temperatura: [15, 23], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Cocinar', image: '/images/cocinar.webp', temperatura: [18, 23], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] }
  ];

  const toggleActivity = (activity) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSave = () => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    savedActivities[date] = activities;
    localStorage.setItem('activitiesByDate', JSON.stringify(savedActivities));

    // Aquí podrías obtener clima desde localStorage si ManualWeather lo guarda ahí
    const weather = JSON.parse(localStorage.getItem('manualWeather')) || { estado: 'soleado', temperatura: 20 };

    const inadecuadas = activities.filter(actName => {
      const act = availableActivities.find(a => a.name === actName);
      return (
        !act.estado.includes(weather.estado) ||
        weather.temperatura < act.temperatura[0] ||
        weather.temperatura > act.temperatura[1]
      );
    });

    if (inadecuadas.length > 0) {
      showNotification('⚠️ Algunas actividades pueden no ser adecuadas por el clima.', 'warning');
    } else {
      showNotification('✅ Actividades guardadas y apropiadas para el clima.', 'success');
    }

    navigate('/');
  };

  const handleDialogClose = (shouldNavigate) => {
    setOpenDialog(false);
    if (shouldNavigate) {
      navigate('/');
    }
  };

  const handleCancel = () => {
    setOpenDialog(true);
  };

  const handleEliminarActivities = () => {
    setActivities([]);
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    delete savedActivities[date];
    localStorage.setItem('activitiesByDate', JSON.stringify(savedActivities));
    showNotification('🗑️ Actividades canceladas.', 'info');
    navigate('/');
  };

  return (
    <Box sx={{ padding: '30px', backgroundColor: '#5767d0', minHeight: '100vh'}}>
      <Typography variant="h4" align="center" gutterBottom  sx={{ color: '#eeeff9', fontSize: '32px', fontWeight: 'bold'}}>
        Seleccionar actividades para {date}
      </Typography>

      <Box sx={{ width: '80%', maxWidth: 500, margin: '0 auto' }}>
        <List>
          {availableActivities.map((activity) => (
            <ListItem
              key={activity.name}
              button
              onClick={() => toggleActivity(activity.name)}
              sx={{
                padding: '10px 20px',
                marginBottom: '2px',
                backgroundColor: activities.includes(activity.name) ? '#7532b0' : 'transparent',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#821add' },
              }}
            >
              <ListItemIcon>
                <img
                  src={activity.image}
                  alt={activity.name}
                  style={{ width: 45, height: 45, objectFit: 'contain' }}
                />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ color: '#eeeff9', fontSize: '20px', fontWeight: 'bold', }}>{activity.name}</Typography>} 
              />
              {/*<ListItemText primary={activity.name} sx={{ color: 'white'}}/>*/}
              {activities.includes(activity.name) && <CheckCircle color="primary" />}
            </ListItem>
          ))}
        </List>
      </Box>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: '#232b60', 
            color: '#fff',           // Color del texto 
          }}
        >
          Guardar y volver
        </Button>
        <Button 
          variant="contained"
          color= 'error'
          onClick={handleCancel}  style={{ marginLeft: '20px' }}>
          Cancelar cambios
        </Button>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>¡Atención!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Seguro que deseas cancelar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            No, continuar
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ActivitySelection;

