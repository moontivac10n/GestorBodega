import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const Inventario = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Simular obtener productos del backend
        const obtenerProductos = async () => {
            const response = await fetch('/api/productos');
            const data = await response.json();
            setProductos(data);
        };
        obtenerProductos();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Gestión de Inventario
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map((producto) => (
                            <TableRow key={producto.id}>
                                <TableCell>{producto.name}</TableCell>
                                <TableCell>{producto.price}</TableCell>
                                <TableCell>{producto.quantity}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="secondary">
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Inventario;
