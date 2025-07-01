import React, { createContext, useState, useEffect } from 'react';
import { getForecastByCity } from '../api/weather';
import { availableActivities } from './activities';

// 1. Crear el contexto con un valor inicial
export const CityContext = createContext({
  city: 'Concepcion', // Ciudad por defecto
  setCity: () => {},
});

// 2. Crear un "Proveedor" que envolverá tu aplicación
export const CityProvider = ({ children }) => {
  const [city, setCity] = useState('Concepcion'); // El estado real vive aquí

  const value = { city, setCity };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};