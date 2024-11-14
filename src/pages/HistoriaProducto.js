import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Modal, Snackbar
} from '@mui/material';

const HistoriaProducto = () => {
    const { auth } = useAuth();
    const [historiaProductos, setHistoriaProductos] = useState([]);
    const [newHistoria, setNewHistoria] = useState({
        name: '', 
        price: '', 
        category_id: '', 
        stock_minimum: '', 
        operation_type: ''
    });
    const [selectedHistoria, setSelectedHistoria] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deletedHistoria, setDeletedHistoria] = useState('');
    const [editedHistoria, setEditedHistoria] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchHistoriaProductos = async () => {
            try {
                const response = await axios.get('http://localhost:4000/historia-producto/', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setHistoriaProductos(response.data);
            } catch (error) {
                console.error("Error al obtener historia de productos:", error);
            }
        };
        fetchHistoriaProductos();
    }, [auth.token]);

    // Handle open and close modals
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenEditModal = (historia) => {
        setSelectedHistoria(historia);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedHistoria(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (selectedHistoria) {
            setSelectedHistoria({ ...selectedHistoria, [name]: value });
        } else {
            setNewHistoria({ ...newHistoria, [name]: value });
        }
    };

    const handleCreateHistoria = async () => {
        try {
            const response = await axios.post('http://localhost:4000/historia-producto/', newHistoria, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setHistoriaProductos([...historiaProductos, response.data]);
            setNewHistoria({
                name: '', 
                price: '', 
                category_id: '', 
                stock_minimum: '', 
                operation_type: ''
            });
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear historia de producto:", error);
        }
    };

    const handleUpdateHistoria = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/historia-producto/${selectedHistoria.id}`, selectedHistoria, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setHistoriaProductos(historiaProductos.map(h => (h.id === selectedHistoria.id ? response.data : h)));
            setEditedHistoria(response.data.name);
            setSelectedHistoria(null);
            handleCloseEditModal();
        } catch (error) {
            console.error("Error al actualizar historia de producto:", error);
        }
    };

    const handleDeleteHistoria = async (id) => {
        try {
            const historiaToDelete = historiaProductos.find((historia) => historia.id === id);
            await axios.delete(`http://localhost:4000/historia-producto/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setHistoriaProductos(historiaProductos.filter((historia) => historia.id !== id));
            setDeletedHistoria(historiaToDelete.name);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error al eliminar historia de producto:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Historial de Productos
            </Typography>

            {/* Button to open the modal for creating a new historia */}
            <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginBottom: 2 }}>
                Agregar Historial de Producto
            </Button>

            {/* Historia de Producto table */}
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Stock Mínimo</TableCell>
                            <TableCell>Tipo de Operación</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historiaProductos.length > 0 ? (
                            historiaProductos.map((historia) => (
                                <TableRow key={historia.id}>
                                    <TableCell>{historia.id}</TableCell>
                                    <TableCell>{historia.name}</TableCell>
                                    <TableCell>{historia.price}</TableCell>
                                    <TableCell>{historia.category_id}</TableCell>
                                    <TableCell>{historia.stock_minimum}</TableCell>
                                    <TableCell>{historia.operation_type}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginRight: 1 }}
                                            onClick={() => handleOpenEditModal(historia)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteHistoria(historia.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Typography>No se encontraron historias de productos</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar for historia de producto deletion */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Historia de producto ${deletedHistoria} eliminada`}
            />

            <Snackbar
                open={!!editedHistoria} // Show snackbar if a historia was edited
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Historia de producto ${editedHistoria} actualizada`}
            />

            {/* Modal to create a new historia */}
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
                        Agregar Historia de Producto
                    </Typography>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={newHistoria.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Precio"
                        name="price"
                        value={newHistoria.price}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        label="Categoría ID"
                        name="category_id"
                        value={newHistoria.category_id}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Stock Mínimo"
                        name="stock_minimum"
                        value={newHistoria.stock_minimum}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        label="Tipo de Operación"
                        name="operation_type"
                        value={newHistoria.operation_type}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateHistoria}>
                        Crear Historia
                    </Button>
                </Box>
            </Modal>

            {/* Modal to edit an existing historia */}
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
                        Editar Historia de Producto
                    </Typography>
                    {selectedHistoria && (
                        <>
                            <TextField
                                label="Nombre"
                                name="name"
                                value={selectedHistoria.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Precio"
                                name="price"
                                value={selectedHistoria.price}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                type="number"
                            />
                            <TextField
                                label="Categoría ID"
                                name="category_id"
                                value={selectedHistoria.category_id}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Stock Mínimo"
                                name="stock_minimum"
                                value={selectedHistoria.stock_minimum}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                type="number"
                            />
                            <TextField
                                label="Tipo de Operación"
                                name="operation_type"
                                value={selectedHistoria.operation_type}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleUpdateHistoria}>
                                Guardar Cambios
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default HistoriaProducto;
