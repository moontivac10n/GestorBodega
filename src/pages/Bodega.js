import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Modal, Snackbar
} from '@mui/material';

const Bodega = () => {
    const { auth } = useAuth();
    const [warehouses, setWarehouses] = useState([]);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '' });
    const [editWarehouse, setEditWarehouse] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deletedWarehouse, setDeletedWarehouse] = useState('');
    const [editedWarehouse, setEditedWarehouse] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState(null);
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarehouse = async () => {
            try {
                const response = await axios.get('http://localhost:4000/warehouse/', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setWarehouses(response.data);
            } catch (error) {
                console.error("Error al obtener bodegas:", error);
            }
        };
        fetchWarehouse();
    }, [auth.token]);

    // Handle open and close modals
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenEditModal = (bodega) => {
        setEditWarehouse(bodega);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditWarehouse(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editWarehouse) {
            setEditWarehouse({ ...editWarehouse, [name]: value });
        } else {
            setNewWarehouse({ ...newWarehouse, [name]: value });
        }
    };

    const handleCreateWarehouse = async (e) => {
        e.preventDefault();
        try {
            const companyId = auth.user.companyId;

            const response = await axios.post('http://localhost:4000/warehouse', {
                ...newWarehouse,
                companyId // Incluir companyId aqui
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setWarehouses([...warehouses, response.data]);
            setNewWarehouse({ name: '', location: '' });
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear la bodega:", error);
            setError('Error al crear la bodega');
        }
    };

    const handleUpdateWarehouse = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/warehouse/${editWarehouse.id}`, editWarehouse, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setWarehouses(warehouses.map(bdg => (bdg.id === editWarehouse.id ? response.data : bdg)));
            setEditedWarehouse(response.data.name);
            setEditWarehouse(null);
            handleCloseEditModal();
        } catch (error) {
            console.error("Error al actualizar bodega:", error);
        }
    };

    const handleDeleteWarehouse = async (id) => {
        try {
            const warehouseToDelete = warehouses.find((warehouse) => warehouse.id === id);
            await axios.delete(`http://localhost:4000/warehouse/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
            setDeletedWarehouse(warehouseToDelete.name);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error al eliminar bodega:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Bodegas
            </Typography>

            {/* Button to open the modal for creating a new bodega */}
            <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginBottom: 2 }}>
                Agregar Bodega
            </Button>

            {/* Bodegas table */}
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Bodega</TableCell>
                            <TableCell>Locacion</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {warehouses.length > 0 ? (
                            warehouses.map((warehouse) => (
                                <TableRow key={warehouse.id}>
                                    <TableCell>{warehouse.id}</TableCell>
                                    <TableCell>{warehouse.name}</TableCell>
                                    <TableCell>{warehouse.location}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginRight: 1 }}
                                            onClick={() => handleOpenEditModal(warehouse)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteWarehouse(warehouse.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography>No se encontraron bodegas</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar for bodega deletion */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Bodega ${deletedWarehouse} eliminada`}
            />

            <Snackbar
                open={!!editedWarehouse} // Show snackbar if a bodega was edited
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Bodega ${editedWarehouse} actualizada`}
            />

            {/* Modal to create a new bodega */}
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
                        Agregar Bodega
                    </Typography>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={newWarehouse.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Locacion"
                        name="location"
                        value={newWarehouse.location}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateWarehouse}>
                        Crear Bodega
                    </Button>
                </Box>
            </Modal>

            {/* Modal to edit an existing bodega */}
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
                        Editar Bodega
                    </Typography>
                    {editWarehouse && (
                        <>
                            <TextField
                                label="Nombre"
                                name="name"
                                value={editWarehouse.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Locacion"
                                name="location"
                                value={editWarehouse.location}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleUpdateWarehouse}>
                                Guardar Cambios
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Bodega;
