import React, { useState, useEffect } from 'react';
import { TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Snackbar, Modal } from '@mui/material';

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deletedInventario, setDeletedInventario] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState(null);
    const [editedInventario, setEditedInventario] = useState('');
    const [newInventario, setNewInventario] = useState({ nombre: '', precio: '', cantidad: '' });
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    // Filtrar productos basado en el término de búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.nombre && producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) // Verifica si `producto.nombre` está definido
    );

    useEffect(() => {
        // Simulación de datos de productos
        const inventarioSimulado = [
            { id: 1, nombre: 'Queso', precio: 1200, cantidad: 300 },
            { id: 2, nombre: 'Leche', precio: 2000, cantidad: 150 },
        ];
        setProductos(inventarioSimulado);
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleDelete = (id) => {
        const inventarioEliminado = productos.find(inventario => inventario.id === id);
        setProductos(productos.filter(inventario => inventario.id !== id));
        setDeletedInventario(inventarioEliminado.nombre);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenEditModal = (inventario) => {
        setSelectedInventario(inventario);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedInventario(null); // Reiniciar selección
    };

        const handleEditInventario = () => {
        // Primero, actualizamos los productos con los cambios
        const updatedProductos = productos.map(producto =>
            producto.id === selectedInventario.id ? selectedInventario : producto
        );
        setProductos(updatedProductos); // Actualizamos el estado de los productos

        // Luego, actualizamos el estado de `editedInventario`
        setEditedInventario(selectedInventario.nombre); // Aquí ya `updatedProductos` está creado

        // Cerramos el modal
        handleCloseEditModal();
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (selectedInventario) {
            setSelectedInventario({ ...selectedInventario, [name]: value });
        } else {
            setNewInventario({ ...newInventario, [name]: value });
        }
    };

    const handleAddInventario = () => {
        const id = productos.length ? productos[productos.length - 1].id + 1 : 1; // Generar un nuevo ID
        setProductos([...productos, { id, ...newInventario }]);
        setNewInventario({ nombre: '', precio: '', cantidad: '' }); // Reiniciar el formulario
        handleCloseModal();
    };

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
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleOpenModal}>
                Agregar Producto
            </Button>

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
                                    <TableCell>{producto.nombre}</TableCell>
                                    <TableCell>${producto.precio}</TableCell>
                                    <TableCell>{producto.cantidad}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => handleOpenEditModal(producto)} //Logica para desplegar modal
                                        >
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
                                <TableCell colSpan={5}>
                                    <Typography>No se encontraron productos</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar para eliminar producto */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Producto ${deletedInventario} eliminado`}
            />

            {/* Snackbar para editar producto */}
            <Snackbar
                open={!!editedInventario}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Producto ${editedInventario} editado`}
            />    

            {/* Modal para agregar producto */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Agregar Producto
                    </Typography>
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={newInventario.nombre}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Precio"
                        name="precio"
                        value={newInventario.precio}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Cantidad"
                        name="cantidad"
                        value={newInventario.cantidad}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleAddInventario}>
                        Agregar
                    </Button>
                </Box>
            </Modal>

            {/* Modal para editar producto */}
            <Modal open={openEditModal} onClose={handleCloseEditModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Editar Producto
                    </Typography>
                    {selectedInventario && (
                        <>
                            <TextField
                                label="Nombre"
                                name="nombre"
                                value={selectedInventario.nombre}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Precio"
                                name="precio"
                                value={selectedInventario.precio}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Cantidad"
                                name="cantidad"
                                value={selectedInventario.cantidad}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleEditInventario}>
                                Guardar Cambios
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Inventario;
