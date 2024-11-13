import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gestor de Bodega
        </Typography>
        <Box sx={{ display: 'flex', gap: '15px' }}>
          <Button color="inherit" component={Link} to="/dashboard">
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/bodega">
            Bodega
          </Button>
          <Button color="inherit" component={Link} to="/inventario">
            Inventario
          </Button>
          <Button color="inherit" component={Link} to="/usuarios">
            Usuarios
          </Button>
          <Button color="inherit" component={Link} to="/categorias">
            Categorias
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/productos">
            Productos
          </Button>
          <Button color="inherit" component={Link} to="/proveedores">
            Proveedores
          </Button>
          <Button color="inherit" component={Link} to="/reportes">
            Reportes
          </Button>
          <Button color="inherit" component={Link} to="/ventas">
            Ventas
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
