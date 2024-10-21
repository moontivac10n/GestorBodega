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
          <Button color="inherit" component={Link} to="/">
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/inventario">
            Inventario
          </Button>
          <Button color="inherit" component={Link} to="/usuarios">
            Usuarios
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
