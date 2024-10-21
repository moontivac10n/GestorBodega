import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Productos = () => {
    const [productos, setProductos] = useState([
        { id: 1, name: 'Laptop', price: 1200, quantity: 10 },
        { id: 2, name: 'Mouse', price: 25, quantity: 100 },
        { id: 3, name: 'Teclado', price: 45, quantity: 50 },
        { id: 4, name: 'Monitor', price: 300, quantity: 15 }
    ]);

    const [newProducto, setNewProducto] = useState({ name: '', price: '', quantity: '' });
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    // Filtrar productos basado en el término de búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAgregar = () => {
        const id = productos.length + 1;
        setProductos([...productos, { id, ...newProducto }]);
        setNewProducto({ name: '', price: '', quantity: '' });
    };

    const handleDelete = (id) => {
        console.log(`Producto con id ${id} eliminado`);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Productos
            </Typography>

            {/* Campo de búsqueda */}
            <TextField
                label="Buscar producto"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <form onSubmit={e => e.preventDefault()}>
                <TextField
                    label="Nombre del Producto"
                    fullWidth
                    margin="normal"
                    value={newProducto.name}
                    onChange={(e) => setNewProducto({ ...newProducto, name: e.target.value })}
                />
                <TextField
                    label="Precio"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={newProducto.price}
                    onChange={(e) => setNewProducto({ ...newProducto, price: e.target.value })}
                />
                <TextField
                    label="Cantidad"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={newProducto.quantity}
                    onChange={(e) => setNewProducto({ ...newProducto, quantity: e.target.value })}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleAgregar}>
                    Agregar Producto
                </Button>
            </form>

            {/* Tabla de productos filtrados */}
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
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

export default Productos;
