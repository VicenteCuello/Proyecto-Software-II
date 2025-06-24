import { Avatar, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserBox({ user }) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderRadius: 2,
        cursor: 'pointer',
        zIndex: 1200,
        '&:hover': {
          backgroundColor: 'grey.100',
        },
      }}
      onClick={() => navigate('/perfil')}
    >
      <Avatar sx={{ bgcolor: 'primary.main' }}>
        {user.name.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="body1">
        {user.name.split(' ')[0]}
      </Typography>
    </Paper>
  );
}

export default UserBox;
