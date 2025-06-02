const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export async function getWeatherByCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener el clima');
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

//obtener pronóstico para los siguientes 5 días
export async function getForecastByCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
  );

  if (!response.ok) {
    throw new Error('No se pudo obtener el pronóstico');
  }

  const data = await response.json();
  return data;
}

