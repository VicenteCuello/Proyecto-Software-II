import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection';
import ManualWeather from './components/ManualWeather';
import NotificationsPage from './components/Notification'; // asegurate que la ruta es correcta
import WeatherPage from './components/WeatherPage';
import WeatherStart from './components/WeatherStart';
import { useState } from 'react';
import Button from '@mui/material/Button';

function Main() {
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
      {/* Botón en la esquina superior izquierda */}
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <Link to="/select-activities/favorites">
          <Button variant="contained" color="primary">
            Actividades Favoritas
          </Button>
        </Link>
      </div>

      {/* Botón en la esquina superior derecha */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <Link to="/calendar">
          <Button variant="contained" color="primary">
            Ir al Calendario
          </Button>
        </Link>
      </div>
      <ManualWeather />
    </div>
  );
}

function CalendarPage() {
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
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <Link to="/">
          <Button variant="contained" color="primary">
            Volver al Clima
          </Button>
        </Link>
      </div>
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
