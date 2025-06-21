import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';

function ProfilePage() {
  const mockUser = {
    name: 'María José Castillo',
    username: 'mj_castillo',
    email: 'mjc@example.com',
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar sx={{ width: 80, height: 80 }}>
              {mockUser.name.charAt(0)}
            </Avatar>
            <Typography variant="h5">{mockUser.name}</Typography>
            <Typography variant="body1"><strong>Usuario:</strong> {mockUser.username}</Typography>
            <Typography variant="body1"><strong>Correo:</strong> {mockUser.email}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProfilePage;