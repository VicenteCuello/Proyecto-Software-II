import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Snackbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import { availableActivities } from '../components/activities';

export function FavoriteActivities() {
  const navigate = useNavigate();
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [activities, setActivities] = useState([]);

useEffect(() => {
  const fetchActivities = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/activities`);
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };
  fetchActivities();
}, []);


 useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      // data es [{id, name, image}, ...]
      setSelectedActivities(data.map(item => item.name));
    } catch (err) {
      console.error(err);
    }
  };

  fetchFavorites();
}, []);


  const toggleActivity = (activityName) => {
    setSelectedActivities(prev => 
      prev.includes(activityName)
        ? prev.filter(name => name !== activityName)
        : [...prev, activityName]
    );
  };

 const handleSave = async () => {
  try {
    const token = localStorage.getItem('authToken');

    // IDs seleccionados actualmente en frontend
    const selectedIds = activities
      .filter(activity => selectedActivities.includes(activity.name))
      .map(activity => activity.id);

    // Obtener favoritos actuales del backend
    const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const currentFavorites = await response.json(); // [ids]

    // Calcular IDs a agregar
    const toAdd = selectedIds.filter(id => !currentFavorites.includes(id));
    // Calcular IDs a eliminar
    const toRemove = currentFavorites.filter(id => !selectedIds.includes(id));

    // Agregar nuevos favoritos
    for (const activityId of toAdd) {
      console.log('Adding activityId:', activityId);
      await fetch(`${process.env.REACT_APP_API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ activityId })
      });
    }

    // Eliminar deseleccionados
    for (const activityId of toRemove) {
      console.log('Removing activityId:', activityId);
      await fetch(`${process.env.REACT_APP_API_URL}/favorites/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    setOpenSnackbar(true);
    setTimeout(() => navigate('/'), 1000);
  } catch (err) {
    console.error(err);
    alert('Error al guardar favoritos.');
  }
};




  const getActivityStyle = (isSelected) => {
    const baseColor = '#5767d0'; // Color base
    const selectedColor = '#4558a0'; // Color 20% más oscuro
    
    return {
      padding: '10px 20px',
      marginBottom: '8px',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      backgroundColor: isSelected ? selectedColor : `${baseColor}80`, // 80 = 50% opacidad
      border: `1px solid ${isSelected ? 'rgba(255,255,255,0.8)' : 'transparent'}`,
      '&:hover': {
        backgroundColor: isSelected ? selectedColor : `${baseColor}99`, // 99 = 60% opacidad
        transform: 'translateY(-2px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }
    };
  };

  return (
    <Box sx={{ 
      padding: 3, 
      backgroundColor: '#5767d0',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" align="center" sx={{ 
        color: 'white', 
        mb: 3,
        fontWeight: 'bold',
        textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
      }}>
        Mis Actividades Favoritas
      </Typography>

      <Box sx={{ 
        maxWidth: 600, 
        mx: 'auto',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        p: 3,
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }}>
        <List>
          {availableActivities.map((activity) => {
            const isSelected = selectedActivities.includes(activity.name);

            return (
              <ListItem
                key={activity.name}
                button
                onClick={() => toggleActivity(activity.name)}
                sx={getActivityStyle(isSelected)}
              >
                <ListItemIcon>
                  <img 
                    src={activity.image} 
                    alt={activity.name}
                    style={{ 
                      width: 50, 
                      height: 50,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'}`,
                      objectFit: 'cover',
                      transition: 'all 0.3s ease',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ 
                      color: 'white',
                      fontWeight: isSelected ? 'bold' : 'medium',
                      fontSize: '1.1rem',
                      transition: 'all 0.2s ease'
                    }}>
                      {activity.name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ 
                      color: 'rgba(245,245,245,0.7)',
                      fontStyle: isSelected ? 'normal' : 'italic'
                    }}>
                    </Typography>
                  }
                />
                {isSelected && <CheckCircle sx={{ 
                  color: 'white',
                  animation: 'pulse 0.5s ease',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }} />}
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mt: 4 
        }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: '#232b60',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#1a203d',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Guardar Favoritos
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(true)}
            sx={{
              px: 4,
              py: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        message="Favoritos guardados correctamente"
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#4558a0',
            color: 'white'
          }
        }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas cancelar? Los cambios no se guardarán.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Continuar editando</Button>
          <Button 
            onClick={() => navigate('/')} 
            color="error"
          >
            Salir sin guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FavoriteActivities;