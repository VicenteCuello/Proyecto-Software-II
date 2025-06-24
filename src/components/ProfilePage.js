import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';

function ProfilePage({ user }) {
  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar sx={{ width: 80, height: 80 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body1"><strong>Usuario:</strong> {user.username}</Typography>
            <Typography variant="body1"><strong>Correo:</strong> {user.email}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProfilePage;