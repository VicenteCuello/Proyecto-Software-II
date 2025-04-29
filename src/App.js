import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection';
import WeatherPage from './components/WeatherPage'; // <-- IMPORTA el nuevo componente
import { useState } from 'react';
import { getWeatherByCity } from './api/weather';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarComponent />} />
        <Route path="/select-activities/:date" element={<ActivitySelection />} />
        <Route path="/weather" element={<WeatherPage />} /> {/* Nueva ruta de clima */}
      </Routes>
    </Router>
  );
}

export default App;
