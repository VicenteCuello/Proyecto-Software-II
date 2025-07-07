import { useEffect, useState } from 'react';
import { Avatar, Box, Typography, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.profile);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <Tooltip 
      title={
        <Typography sx={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>
          Ver perfil
        </Typography>
      }
      arrow
      slotProps={{
        popper: {
          modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
        },
        tooltip: {
          sx: { bgcolor: 'black', borderRadius: 2, px: 1.5, py: 0.5 },
        },
        arrow: { sx: { color: 'black' } },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 8,
          right: 8,
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1200,
          borderRadius: '50%',
          '&:hover': { backgroundColor: '#ffffff' },
        }}
        onClick={() => navigate('/perfil')}
      >
        <Avatar sx={{ bgcolor: 'black' }}>
          {user.nombre.charAt(0).toUpperCase()}
        </Avatar>
      </Box>
    </Tooltip>
  );
}

export default ViewProfile;
