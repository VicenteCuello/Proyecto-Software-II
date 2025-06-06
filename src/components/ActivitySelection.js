// Importa los componentes necesarios de Material UI para crear la interfaz
import React, { useState } from 'react';
import { Button, Snackbar, Typography, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
// Importa los hooks de React Router para la navegación y manejo de parámetros de URL
import { useNavigate, useParams } from 'react-router-dom';
// Importa el icono de CheckCircle de Material UI para mostrar un símbolo de verificación
import { CheckCircle } from '@mui/icons-material';
import { availableActivities } from '../components/activities';

// Componente ActivitySelection
function ActivitySelection() {
  // Obtiene el parámetro 'date' desde la URL
  const { date } = useParams();
  // Hook de navegación para redirigir a otras rutas
  const navigate = useNavigate();

  // Estado para gestionar las actividades seleccionadas
  const [activities, setActivities] = useState(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    // Si estamos en la página de 'favoritos', cargamos las actividades favoritas
    if (date === 'favorites') {
      return savedActivities.favorites || [];
    }
    // Si no, cargamos las actividades para la fecha específica
    return savedActivities[date] || [];
  });

  // Estados para manejar la visibilidad de los componentes de Snackbar y Dialog
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Actividades disponibles con sus detalles (nombre, imagen, rango de temperatura y estados del clima)
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

  // Función para alternar la selección de actividades (añadir o eliminar de la lista)
  const toggleActivity = (activity) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  // Función para guardar las actividades seleccionadas en el localStorage
  const handleSave = () => {
    const savedActivities = JSON.parse(localStorage.getItem('activitiesByDate')) || {};
    // Guarda las actividades en la fecha correspondiente o en favoritos
    if (date === 'favorites') {
      savedActivities.favorites = activities;
    } else {
      savedActivities[date] = activities;
    }
    // Actualiza el localStorage con las actividades guardadas
    localStorage.setItem('activitiesByDate', JSON.stringify(savedActivities));
    console.log(`Actividades registradas para ${date}:`, activities);
    // Muestra un mensaje de éxito y redirige a la página principal
    setOpenSnackbar(true);
    setTimeout(() => {
      setOpenSnackbar(false);
      navigate('/'); // Redirige al inicio después de guardar
    }, 1000);
  };

  // Función para cerrar el diálogo de confirmación
  const handleDialogClose = (shouldNavigate) => {
    setOpenDialog(false);
    if (shouldNavigate) {
      navigate('/'); // Redirige al inicio si el usuario cancela
    }
  };

  // Función para abrir el diálogo de confirmación de cancelación
  const handleCancel = () => {
    setOpenDialog(true);
  };

  return (
    <Box sx={{ padding: '30px', backgroundColor: '#5767d0', minHeight: '100vh' }}>
      {/* Título de la página con un estilo personalizado */}
      <Typography variant="h4" align="center" gutterBottom sx={{ color: '#eeeff9', fontSize: '32px', fontWeight: 'bold' }}>
        Seleccionar actividades para {date === 'favorites' ? 'Favoritas' : date}
      </Typography>

      <Box sx={{ width: '80%', maxWidth: 500, margin: '0 auto' }}>
        {/* Lista de actividades disponibles */}
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
                {/* Muestra la imagen de la actividad */}
                <img
                  src={activity.image}
                  alt={activity.name}
                  style={{ width: 45, height: 45, objectFit: 'contain' }}
                />
              </ListItemIcon>
              {/* Nombre de la actividad */}
              <ListItemText primary={<Typography sx={{ color: '#eeeff9', fontSize: '20px', fontWeight: 'bold' }}>{activity.name}</Typography>} />
              {/* Muestra un icono de verificación si la actividad está seleccionada */}
              {activities.includes(activity.name) && <CheckCircle color="primary" />}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Botones para guardar o cancelar cambios */}
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

      {/* Snackbar que muestra un mensaje de éxito al guardar las actividades */}
      <Snackbar
        open={openSnackbar}
        message="Actividades guardadas con éxito"
        autoHideDuration={2000}
      />

      {/* Diálogo de confirmación para cancelar cambios */}
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

export default ActivitySelection; // Exporta el componente para que se pueda usar en otras partes de la aplicación
