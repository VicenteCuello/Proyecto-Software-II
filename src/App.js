import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection';
import ManualWeather from './components/ManualWeather';
<<<<<<< HEAD
=======
import NotificationsPage from './components/Notification';
import WeatherPage from './components/WeatherPage';
import WeatherStart from './components/WeatherStart';
import WeatherCurrentLocation from './components/WeatherCurrentLocation';

>>>>>>> a7bf6d73 (Integración del clima por ubicación actual)
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';

// Componente Sidebar
function Sidebar({ options }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {options.map((option, index) => (
            <ListItem key={index}>
              <ListItemButton component={Link} to={option.path}>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

function Main() {
  const options = [
    { label: 'Ir al Calendario', path: '/calendar' },
    { label: 'Actividades Favoritas', path: '/select-activities/favorites' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '200vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sidebar options={options} />
      <WeatherStart />
      <div style={{ marginTop: 20 }}>
        <WeatherCurrentLocation />
      </div>
    </div>
  );
}

function CalendarPage() {
  const options = [{ label: 'Volver al Clima', path: '/' }];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sidebar options={options} />
      <CalendarComponent />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/select-activities/:date" element={<ActivitySelection />} />
          <Route path="/select-activities/favorites" element={<ActivitySelection />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
<<<<<<< HEAD

=======
>>>>>>> a7bf6d73 (Integración del clima por ubicación actual)
