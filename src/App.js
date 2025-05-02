import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection';
import ManualWeather from './components/ManualWeather';
import NotificationsPage from './components/Notification'; // ⬅️ Asegúrate de que la ruta sea correcta

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<CalendarComponent />} />
          <Route path="/select-activities/:date" element={<ActivitySelection />} />
          <Route path="/notifications" element={<NotificationsPage/>} /> {/* ⬅️ Agregado */}
        </Routes>
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
          <ManualWeather />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;


