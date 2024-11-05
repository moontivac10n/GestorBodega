import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Modal } from '@mui/material';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deletedProducto, setDeletedProducto] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [newProducto, setNewProducto] = useState({ nombre: '', precio: '', cantidad: '' });
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    // Filtrar productos basado en el término de búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.nombre && producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) // Verifica si `producto.nombre` está definido
    );

    useEffect(() => {
        // Simulación de datos de productos
        const productosSimulados = [
            { id: 1, nombre: 'Producto A', precio: 1200, cantidad: 300 },
            { id: 2, nombre: 'Producto B', precio: 45, cantidad: 180 },
        ];
        setProductos(productosSimulados);
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleDelete = (id) => {
        const productoEliminado = productos.find(producto => producto.id === id);
        setProductos(productos.filter(producto => producto.id !== id));
        setDeletedProducto(productoEliminado.nombre);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenEditModal = (producto) => {
        setSelectedProducto(producto);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedProducto(null); // Reiniciar selección
    };

    const handleEditProducto = () => {
        const updatedProductos = productos.map(producto =>
            producto.id === selectedProducto.id ? selectedProducto : producto
        );
        setProductos(updatedProductos);
        handleCloseEditModal();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (selectedProducto) {
            setSelectedProducto({ ...selectedProducto, [name]: value });
        } else {
            setNewProducto({ ...newProducto, [name]: value });
        }
    };

    const handleAddProducto = () => {
        const id = productos.length ? productos[productos.length - 1].id + 1 : 1; // Generar un nuevo ID
        setProductos([...productos, { id, ...newProducto }]);
        setNewProducto({ nombre: '', contacto: '' }); // Reiniciar el formulario
        handleCloseModal();
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
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleOpenModal}>
                Agregar Productos
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Producto ${deletedProducto} eliminado`}
            />
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
                        value={newProducto.nombre}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Precio"
                        name="precio"
                        value={newProducto.precio}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Cantidad"
                        name="cantidad"
                        value={newProducto.cantidad}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleAddProducto}>
                        Agregar
                    </Button>
                </Box>
            </Modal>

            {/* Modal para editar proveedor */}
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
                    {selectedProducto && (
                        <>
                            <TextField
                                label="Nombre"
                                name="nombre"
                                value={selectedProducto.nombre}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Precio"
                                name="precio"
                                value={selectedProducto.precio}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Cantidad"
                                name="cantidad"
                                value={selectedProducto.cantidad}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />

                            <Button variant="contained" color="primary" onClick={handleEditProducto}>
                                Guardar Cambios
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Productos;
