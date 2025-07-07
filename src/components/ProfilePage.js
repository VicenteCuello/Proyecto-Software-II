import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No estás autenticado');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.profile);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        alert('Hubo un error al obtener tu perfil.');
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography variant="h6" color="text.secondary">Cargando perfil...</Typography>
      </Box>
    );
  }

  const username = user.nombre;
  //const useremail = user.email;
  const createdAt = new Date(user.created_at);
  const fechaFormateada = createdAt.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{padding: 2 }}
    >
      <Card sx={{ width: 400, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar sx={{ width: 90, height: 90, bgcolor: 'black', fontSize: 36 }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {username}
            </Typography>
            <Divider sx={{ width: '100%', my: 1 }} />
            <Box width="100%">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Correo electrónico:
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box width="100%">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Miembro desde:
              </Typography>
              <Typography variant="body1">{fechaFormateada}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ backgroundColor: '#232b60', mt: 4, width: 200, borderRadius: 2 }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
}

export default ProfilePage;
