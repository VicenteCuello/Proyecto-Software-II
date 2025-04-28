import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection'; // Nueva pantalla

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarComponent />} />
        <Route path="/select-activities/:date" element={<ActivitySelection />} />
      </Routes>
    </Router>
  );
}

export default App;

