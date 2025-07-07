// Importa los componentes necesarios de react-router-dom para la navegación
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation} from 'react-router-dom';

// Importa el proveedor de tema de Material UI y el tema personalizado
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Importa los componentes para las diferentes páginas de la app
import CalendarComponent from './components/CalendarComponent';
import ActivitySelection from './components/ActivitySelection';
import FavoriteActivities from './components/FavoriteActivities';
import ManualWeather from './components/ManualWeather';
import NotificationsPage from './components/Notification';
import WeatherPage from './components/WeatherPage';
import WeatherStart from './components/WeatherStart';
import Login from './components/Login';
import ViewProfile from './components/ViewProfile';
import ProfilePage from './components/ProfilePage';
import Register from './components/Register';
import RequireAuth from './components/RequireAuth';
import { CityProvider } from './components/CityContext';

// Importa los componentes de Material UI para la barra lateral
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// Importa el hook de estado de React
import { useState } from 'react';

// Componente Sidebar: Barra lateral de navegación
function Sidebar({ options }) {
  // Estado para manejar la apertura y cierre de la barra lateral
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();


  // Función para cambiar el estado de la barra lateral (abrir o cerrar)
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setDrawerOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* Botón para abrir la barra lateral */}
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </div>

      {/* Barra lateral que contiene las opciones de navegación */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          {options.map((option, index) => (
            <ListItem key={index}>
              {/* Elemento de lista como un enlace de navegación */}
              <ListItemButton component={Link} to={option.path}>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key="logout" disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

// Componente principal de la página de inicio
function Main() {
  const options = [
    { label: 'Ir al Calendario', path: '/calendar' },
    { label: 'Actividades Favoritas', path: '/select-activities/favorites' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Alto suficiente para ver el contenido
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sidebar options={options} /> {/* Renderiza la barra lateral */}
      <WeatherStart /> {/* Componente de inicio de clima */}
    </div>
  );
}

// Página de Calendario
function CalendarPage() {
  const options = [{ label: 'Volver al Clima', path: '/' }];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // 100% de la altura de la ventana
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sidebar options={options} /> {/* Renderiza la barra lateral con una opción */}
      <CalendarComponent /> {/* Componente del calendario */}
    </div>
  );
}

//mostrar informacion del perfil solo si no se está en login y registro
function ConditionalProfile() {
  const location = useLocation();
  const hiddenPaths = ['/', '/register']; // pestañas en donde no se muestra

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return <ViewProfile />;
}

// Componente principal de la aplicación que maneja las rutas
function App() {
  return (
    // Proveedor de tema de Material UI
    <ThemeProvider theme={theme}>
      {/* Router para manejar las rutas de la aplicación */}
      <CityProvider>
      <Router>
        <ConditionalProfile /> 
        <Routes>
          {/* Rutas de la aplicación */}
          {/* públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* protegidas */}
          <Route path="/home" element={<RequireAuth><Main /></RequireAuth>} />
          <Route path="/calendar" element={<RequireAuth><CalendarPage /></RequireAuth>} />
          <Route path="/select-activities/:date" element={<RequireAuth><ActivitySelection /></RequireAuth>} />
          <Route path="/select-activities/favorites" element={<RequireAuth><FavoriteActivities /></RequireAuth>} />
          <Route path="/WeatherPage" element={<RequireAuth><WeatherPage /></RequireAuth>} />
          <Route path="/Perfil" element={<RequireAuth><ProfilePage /></RequireAuth>} />

          {/* Si entran a cualquier otra ruta, van al login */}
+         <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </CityProvider>
    </ThemeProvider>
  );
}

export default App; // Exporta el componente App
