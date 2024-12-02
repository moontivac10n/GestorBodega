import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import Proveedores from './pages/Proveedores';
import Reportes from './pages/Reportes';
import Ventas from './pages/Ventas';
import Bodega from './pages/Bodega';
import HistoriaProducto from './pages/HistoriaProducto';
import Analisis from './pages/Analisis';

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

const AppContent = () => {
  const { auth, loading } = useAuth();
  console.log(auth)
  if (loading) return <p>Cargando...</p>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                auth.token 
                  ? (auth.isCompany ? <Dashboard /> : <Dashboard />) 
                  : <Navigate to="/login" />
              }
            />
            <Route 
              path="/bodega" 
              element={
                auth.token
                ? (auth.isCompany ? <Bodega /> : <Bodega />)
                : <Navigate to="/login" />
              }
            />

            <Route path="/historial" element={<HistoriaProducto />} />

            <Route 
              path="/inventario" 
              element={
                auth.token
                ? (auth.isCompany ? <Inventario /> : <Inventario />)
                : <Navigate to="/login" />
              }
            />

            <Route 
              path="/usuarios" 
              element={
                auth.token
                ? (auth.isCompany ? <Usuarios /> : <Usuarios />)
                : <Navigate to="/login" />
              }
            />

            <Route 
              path="/categorias" 
              element={
                auth.token
                ? (auth.isCompany ? <Categorias /> : <Categorias />)
                : <Navigate to="/login" />
              }
            />

            <Route path="/login" element={<Login />} />

            <Route 
              path="/productos" 
              element={
                auth.token
                ? (auth.isCompany ? <Productos /> : <Productos />)
                : <Navigate to="/login" />
              }
            />

            <Route path="/register" element={<Register />} />

            <Route 
              path="/proveedores" 
              element={
                auth.token
                ? (auth.isCompany ? <Proveedores /> : <Proveedores />)
                : <Navigate to="/login" />
              }
            />

            <Route 
              path="/reportes" 
              element={
                auth.token
                ? (auth.isCompany ? <Reportes /> : <Reportes />)
                : <Navigate to="/login" />
              }
            />

            <Route 
              path="/ventas" 
              element={
                auth.token
                ? (auth.isCompany ? <Ventas /> : <Ventas />)
                : <Navigate to="/login" />
              }
            />

            <Route 
              path="/analisis" 
              element={
                auth.token
                ? (auth.isCompany ? <Analisis /> : <Analisis />)
                : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
        <Footer />
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
