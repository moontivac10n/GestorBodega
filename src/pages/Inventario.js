import React, { useState, useEffect } from 'react';
import { TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';


const Inventario = () => {
    const [productos, setProductos] = useState([
        { id: 1, name: 'Laptop', price: 1200, quantity: 10 },
        { id: 2, name: 'Mouse', price: 25, quantity: 100 },
        { id: 3, name: 'Teclado', price: 45, quantity: 50 },
        { id: 4, name: 'Monitor', price: 300, quantity: 15 }
    ]);

    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    // Filtrar productos basado en el término de búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        console.log(`Producto con id ${id} eliminado`);
    };

    useEffect(() => {
        //obtener productos del backend
        const obtenerProductos = async () => {
            const response = await fetch('/api/productos');
            const data = await response.json();
            setProductos(data);
        };
        obtenerProductos();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Inventario
            </Typography>

            {/* Campo de búsqueda */}
            <TextField
                label="Buscar producto"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Producto</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <TableRow key={producto.id}>
                                    <TableCell>{producto.id}</TableCell>
                                    <TableCell>{producto.name}</TableCell>
                                    <TableCell>${producto.price}</TableCell>
                                    <TableCell>{producto.quantity}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                            Editar
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(producto.id)}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography>No se encontraron productos</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Inventario;

