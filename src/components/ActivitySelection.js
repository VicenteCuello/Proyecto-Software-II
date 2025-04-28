import React, { useState } from 'react';
import { Button, Snackbar, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material'; // Icono para seleccionar actividad

function ActivitySelection() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]); //activities es el array del usuario
  const [openSnackbar, setOpenSnackbar] = useState(false); //para cuando selecciona "guardar"
  const [openDialog, setOpenDialog] = useState(false); // para cuando selecciona volver

  const availableActivities = [ //array de actividades disponibles con su nombre y elemento grafico
    { name: 'Yoga', image: '/images/yoga.webp' },
    { name: 'Correr', image: '/images/correr.webp' },
    { name: 'Leer', image: '/images/leer.webp' },
    { name: 'Estudiar React', image: '/images/estudiar react.webp' },
    { name: 'Ir al cine', image: '/images/ir al cine.webp' },
    { name: 'Ir al gym', image: '/images/ir al gym.webp' },
    { name: 'Ir de compras', image: '/images/Ir de compras.webp' },
    { name: 'Cocinar', image: '/images/cocinar.webp' }
  ];
//funcion para agregar y/o eliminar actividades:
  const toggleActivity = (activity) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };
//funcion para volver al calendario al presionar guardar: 
  const handleSave = () => {
    console.log(`Actividades registradas para ${date}:`, activities);
    setOpenSnackbar(true); //mensaje de confirmacion al guardar actividades
    setTimeout(() => {
      setOpenSnackbar(false);
      navigate('/'); //volver al calendario
    }, 1000); //mensaje se muestra por un segundo (tiempo de espera)
  };

  //volver al calendario si se confirma "cancelar"
  const handleDialogClose = (shouldNavigate) => {
    setOpenDialog(false);
    if (shouldNavigate) { //si confirma cancelar vuelve al calendario
      navigate('/'); 
    }
  };
//cuando se presiona cancelar
  const handleCancel = () => {
    setOpenDialog(true); // Mostrar el diálogo de confirmación
  };

  return (
    <div style={{ padding: '30px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Seleccionar actividades para {date}
      </Typography>

      {/* Lista de actividades contenida en la estructura Box */}
      <Box sx={{ width: '80%', maxWidth: 500, margin: '0 auto' }}>
        <List>
          {availableActivities.map((activity) => ( //mostrar actividades disponibles
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
        {/* Botón para guardar y volver */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={activities.length === 0} // que no se pueda seleccionar si no elige ninguna actividad
        >
          Guardar y volver
        </Button>
        {/* Botón para cancelar */}
        <Button onClick={handleCancel} color="secondary" style={{ marginLeft: '20px' }}>
          Cancelar
        </Button>
      </div>

      {/* mensaje al confirmar actividades seleccionadas ("guardar") */}
      <Snackbar
        open={openSnackbar}
        message="Actividades guardadas con éxito"
        autoHideDuration={2000} // Se cierra automáticamente después de 2 segundos
      />

      {/* mensaje al presionar "cancelar" */}
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

