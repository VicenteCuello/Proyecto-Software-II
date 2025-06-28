import { Box, Card, CardContent, Typography, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ user }) {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4} gap={3}>
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'black' }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body1"><strong>Usuario:</strong> {user.username}</Typography>
            <Typography variant="body1"><strong>Correo:</strong> {user.email}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Button 
        variant="contained" 
        onClick={() => navigate('/')} 
        sx={{ width: 200 }}  // ancho fijo para mejor apariencia
      >
        Volver al inicio
      </Button>
    </Box>
  );
}

export default ProfilePage;