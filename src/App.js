import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection';
import ManualWeather from './components/ManualWeather';
import NotificationsPage from './components/Notification'; // ⬅️ Asegúrate de que la ruta sea correcta
import WeatherPage from './components/WeatherPage'; // <-- IMPORTA el nuevo componente
import WeatherStart from './components/WeatherStart';
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
      {/* Botón para abrir la barra lateral */}
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Barra lateral */}
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
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sidebar options={options} />
      <ManualWeather />
      <WeatherStart />

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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;





