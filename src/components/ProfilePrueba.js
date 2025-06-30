import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function ProfilePrueba() {
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

        setUser(response.data.profile); // 💡 tu backend devuelve { profile: { ... } }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        alert('Hubo un error al obtener tu perfil.');
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <Typography>Cargando perfil...</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} gap={3}>
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'black' }}>
              {user.name ? user.name.charAt(0) : user.email.charAt(0)}
            </Avatar>
            <Typography variant="h5">{user.name ?? user.email}</Typography>
            {user.username && (
              <Typography variant="body1">
                <strong>Usuario:</strong> {user.username}
              </Typography>
            )}
            <Typography variant="body1">
              <strong>Correo:</strong> {user.email}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Button 
        variant="contained" 
        onClick={() => navigate('/')} 
        sx={{ width: 200 }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
}

export default ProfilePrueba;