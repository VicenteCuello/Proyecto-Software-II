import React, { useState } from 'react';
import { Button, Snackbar, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';

function ActivitySelection() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [activities, setActivities] = useState(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    return savedActivities[date] || [];
  });

  const [openDialog, setOpenDialog] = useState(false);

  const availableActivities = [
    { name: 'Yoga', image: '/images/yoga.webp' },
    { name: 'Correr', image: '/images/correr.webp' },
    { name: 'Leer', image: '/images/leer.webp' },
    { name: 'Estudiar React', image: '/images/estudiar react.webp' },
    { name: 'Ir al cine', image: '/images/ir al cine.webp' },
    { name: 'Ir al gym', image: '/images/ir al gym.webp' },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp' },
    { name: 'Cocinar', image: '/images/cocinar.webp' }
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
