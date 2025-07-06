import React, { createContext, useState } from 'react';

// Crear el contexto con un valor inicial
export const CityContext = createContext({
  city: 'Concepcion', // Ciudad por defecto
  setCity: () => {},
  hasCalendarAlert: false, // Nuevo estado para la alerta
  setHasCalendarAlert: () => {}, // Nueva función para actualizar la alerta
});

// Crear un "Proveedor" que envolverá tu aplicación
export const CityProvider = ({ children }) => {
  const [city, setCity] = useState('Concepcion'); // El estado real vive aquí
  const [hasCalendarAlert, setHasCalendarAlert] = useState(false); // Estado para la alerta

  const value = { city, setCity, hasCalendarAlert, setHasCalendarAlert };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};