import React, { createContext, useState } from 'react';

// Crear el contexto con un valor inicial
export const CityContext = createContext({
  city: 'Concepcion', // Ciudad por defecto
  setCity: () => {},
});

// Crear un "Proveedor" que envolverá tu aplicación
export const CityProvider = ({ children }) => {
  const [city, setCity] = useState('Concepcion'); // El estado real vive aquí

  const value = { city, setCity };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};