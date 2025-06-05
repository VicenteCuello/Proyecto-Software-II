import React from 'react'; // Importa la biblioteca de React para la construcción de la UI
import ReactDOM from 'react-dom/client'; // Importa el DOM de React para renderizar el contenido
import './index.css'; // Importa los estilos CSS globales
import App from './App'; // Importa el componente principal de la aplicación
import reportWebVitals from './reportWebVitals'; // Importa la función para medir el rendimiento de la aplicación

// Crea un root de React en el elemento con el id 'root' en el HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación dentro del root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// Mide el rendimiento de la aplicación y envía los resultados a un servicio de análisis
reportWebVitals();
