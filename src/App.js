import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Usuarios from './pages/Usuarios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Categorias from './pages/Categorias';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', //Azul oscuro
    },
    secondary: {
      main: '#ff6f00', //Naranja vibrante
    },
    background: {
      default: '#f4f6f8', //Fondo claro
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
