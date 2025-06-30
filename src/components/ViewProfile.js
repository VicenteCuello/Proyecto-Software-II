import { useEffect, useState } from 'react';
import { Avatar, Box, Typography, Tooltip} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewProfile({ user }) {
  const navigate = useNavigate();

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
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 4], //que tan abajo sale Tooltip
              },
            },
          ],
        },
        tooltip: {
          sx: {
            bgcolor: 'black',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
          },
        },
        arrow: {
          sx: {
            color: 'black',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          width: 48,          
          height: 48,
          //padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          //gap: 1.5,
          cursor: 'pointer',
          zIndex: 1200,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: '#2e4053',
            //borderRadius: 3, 
          },
        }}
        onClick={() => navigate('/perfil')}
      >
        <Avatar sx={{ bgcolor: 'black' }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        {/*
        <Typography variant="body1">
          {user.name.split(' ')[0]}
        </Typography> */}
      </Box>
    </Tooltip>
  );
}

export default ViewProfile;
