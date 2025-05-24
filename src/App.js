import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection';
import ManualWeather from './components/ManualWeather';
import NotificationsPage from './components/Notification'; // ⬅️ Asegúrate de que la ruta sea correcta
import WeatherPage from './components/WeatherPage'; // <-- IMPORTA el nuevo componente
import WeatherStart from './components/WeatherStart';
import { useState } from 'react';
import { getWeatherByCity } from './api/weather';
import Button from '@mui/material/Button';

function Main() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
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
          <Route path="/" element={
            <>
            <CalendarComponent />
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
              <ManualWeather />
            </div>
            <div style={{ position: 'absolute', top: '10px', left: '1200px', zIndex: 1000 }}>
              <WeatherStart />
            </div>
            </>
          } />
          <Route path="/select-activities/:date" element={<ActivitySelection />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;



