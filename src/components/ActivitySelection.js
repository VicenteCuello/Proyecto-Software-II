import React, { useState } from 'react';
import { Button, Snackbar, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';

function ActivitySelection() {
  const { date } = useParams(); 
  const navigate = useNavigate();

  const [activities, setActivities] = useState(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    if (date === 'favorites') {
      return savedActivities.favorites || [];
    }
    return savedActivities[date] || [];
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const availableActivities = [
    { name: 'Yoga', image: '/images/yoga.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Correr', image: '/images/correr.webp', temperatura: [5, 25], estado: ['soleado', 'nublado', 'viento', 'niebla'] },
    { name: 'Leer', image: '/images/leer.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Estudiar React', image: '/images/estudiar react.webp', temperatura: [18, 24], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
    { name: 'Ir al cine', image: '/images/ir al cine.webp', temperatura: [18, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir al gym', image: '/images/ir al gym.webp', temperatura: [16, 22], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp', temperatura: [15, 23], estado: ['soleado', 'nublado', 'lluvioso', 'viento', 'niebla'] },
    { name: 'Cocinar', image: '/images/cocinar.webp', temperatura: [18, 23], estado: ['soleado', 'nublado', 'lluvioso', 'tormenta', 'viento', 'niebla'] },
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
    if (date === 'favorites') {
      savedActivities.favorites = activities;
    } else {
      savedActivities[date] = activities;
    }
    localStorage.setItem('activitiesByDate', JSON.stringify(savedActivities));
    console.log(`Actividades registradas para ${date}:`, activities);
    setOpenSnackbar(true);
    setTimeout(() => {
      setOpenSnackbar(false);
      if (date === 'favorites') {
        navigate('/'); // Redirige al main para actividades favoritas.
      } else {
        navigate('/'); // Redirige al calendario para las fechas.
      }
    }, 1000);
  };

  const handleDialogClose = (shouldNavigate) => {
    setOpenDialog(false);
    if (shouldNavigate) {
      if (date === 'favorites') {
        navigate('/');
      } else {
        navigate('/');
      }
    }
  };

  const handleCancel = () => {
    setOpenDialog(true);
  };

  return (
    <Box sx={{ padding: '30px', backgroundColor: '#5767d0', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#eeeff9', fontSize: '32px', fontWeight: 'bold' }}>
        Seleccionar actividades para {date === 'favorites' ? 'Favoritas' : date}
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
              <ListItemText primary={<Typography sx={{ color: '#eeeff9', fontSize: '20px', fontWeight: 'bold' }}>{activity.name}</Typography>} />
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
            color: '#fff',
          }}
        >
          Guardar y volver
        </Button>
        <Button 
          variant="contained"
          color='error'
          onClick={handleCancel}
          style={{ marginLeft: '20px' }}
        >
          Cancelar cambios
        </Button>
      </div>

      <Snackbar
        open={openSnackbar}
        message="Actividades guardadas con éxito"
        autoHideDuration={2000}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>¡Advertencia!</DialogTitle>
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
