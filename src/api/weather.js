const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
  const response = await fetch(url);

  if (!response.ok) {
    // Obtener el mensaje de error que envía la API (ej. "city not found")
    const errorData = await response.json();
    throw new Error(errorData.message || 'No se pudo obtener el clima');
  }

  const data = await response.json();
  return data;
}


export async function getWeatherByCoords(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener el clima');
  }

  
  const data = await response.json();
  return data;
}

export async function getForecastByCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener el pronóstico');
  }

  return response.json();
}
