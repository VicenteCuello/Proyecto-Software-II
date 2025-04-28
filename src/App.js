import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection'; // Nueva pantalla

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<CalendarComponent />} />
          <Route path="/select-activities/:date" element={<ActivitySelection />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

