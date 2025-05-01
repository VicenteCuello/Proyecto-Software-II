import React, { useState } from 'react';
import { Button, Snackbar, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';

function ActivitySelection() {
  const { date } = useParams(); 
  const navigate = useNavigate();

  /*el estado activities comienza con las actividades guardadas en la 
   fecha date si es que hay */
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
    { name: 'Ir al gym', image: '/images/ir al gym.webp', temperatura: [16, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla', 'viento', 'niebla'] },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp', temperatura: [15, 23], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Cocinar', image: '/images/cocinar.webp', temperatura: [18, 23], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] }
  ];

  /*agregar o quitar actividades del estado activities*/
  const toggleActivity = (activity) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };
/*se guardan la actividades selecciondas en localStorage con la clave 
 activitiesByDate y vuelve al calendario */
  const handleSave = () => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    savedActivities[date] = activities;
    localStorage.setItem('activitiesByDate', JSON.stringify(savedActivities));

    console.log(`Actividades registradas para ${date}:`, activities);
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

  const handleClearActivities = () => {
    setActivities([]);
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    delete savedActivities[date]; // elimina las actividades guardadas para la fecha actual
    localStorage.setItem('activitiesByDate', JSON.stringify(savedActivities));
    navigate('/');
  };

  return (
    <div style={{ padding: '30px' }}>
      <Typography variant="h4" align="center" gutterBottom>
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
                backgroundColor: activities.includes(activity.name) ? '#e3f2fd' : 'transparent',
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#f1f1f1' },
              }}
            >
              <ListItemIcon>
                <img
                  src={activity.image}
                  alt={activity.name}
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
              </ListItemIcon>
              <ListItemText primary={activity.name} />
              {activities.includes(activity.name) && <CheckCircle color="primary" />}
            </ListItem>
          ))}
        </List>
      </Box>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={activities.length === 0}
        >
          Guardar y volver
        </Button>
        <Button onClick={handleCancel} color="secondary" style={{ marginLeft: '20px' }}>
          Cancelar
        </Button>
        {activities.length > 0 && (
          <Button onClick={handleClearActivities} style={{ marginLeft: '20px' }}>
            Cancelar actividades
          </Button>
        )}
        {/*<Button onClick={handleClearActivities} style={{ marginLeft: '20px' }}>
         Cancelar todas las actividades
        </Button>*/}
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
    </div>
  );
}

export default ActivitySelection;
