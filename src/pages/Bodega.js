import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Modal, Snackbar
} from '@mui/material';

const Bodega = () => {
    const { auth } = useAuth();
    const [bodegas, setBodegas] = useState([]);
    const [newBodega, setNewBodega] = useState({ name: '', description: '' });
    const [selectedBodega, setSelectedBodega] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deletedBodega, setDeletedBodega] = useState('');
    const [editedBodega, setEditedBodega] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchBodegas = async () => {
            try {
                const response = await axios.get('http://localhost:4000/bodega/', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setBodegas(response.data);
            } catch (error) {
                console.error("Error al obtener bodegas:", error);
            }
        };
        fetchBodegas();
    }, [auth.token]);

    // Handle open and close modals
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenEditModal = (bodega) => {
        setSelectedBodega(bodega);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedBodega(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (selectedBodega) {
            setSelectedBodega({ ...selectedBodega, [name]: value });
        } else {
            setNewBodega({ ...newBodega, [name]: value });
        }
    };

    const handleCreateBodega = async () => {
        try {
            const response = await axios.post('http://localhost:4000/bodega/', newBodega, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setBodegas([...bodegas, response.data]);
            setNewBodega({ name: '', description: '' });
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear bodega:", error);
        }
    };

    const handleUpdateBodega = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/bodega/${selectedBodega.id}`, selectedBodega, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setBodegas(bodegas.map(bdg => (bdg.id === selectedBodega.id ? response.data : bdg)));
            setEditedBodega(response.data.name);
            setSelectedBodega(null);
            handleCloseEditModal();
        } catch (error) {
            console.error("Error al actualizar bodega:", error);
        }
    };

    const handleDeleteBodega = async (id) => {
        try {
            const bodegaToDelete = bodegas.find((bodega) => bodega.id === id);
            await axios.delete(`http://localhost:4000/bodega/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setBodegas(bodegas.filter((bodega) => bodega.id !== id));
            setDeletedBodega(bodegaToDelete.name);
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
                            <TableCell>Descripción</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bodegas.length > 0 ? (
                            bodegas.map((bodega) => (
                                <TableRow key={bodega.id}>
                                    <TableCell>{bodega.id}</TableCell>
                                    <TableCell>{bodega.name}</TableCell>
                                    <TableCell>{bodega.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginRight: 1 }}
                                            onClick={() => handleOpenEditModal(bodega)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeleteBodega(bodega.id)}
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
                message={`Bodega ${deletedBodega} eliminada`}
            />

            <Snackbar
                open={!!editedBodega} // Show snackbar if a bodega was edited
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Bodega ${editedBodega} actualizada`}
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
                        value={newBodega.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={newBodega.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateBodega}>
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
                    {selectedBodega && (
                        <>
                            <TextField
                                label="Nombre"
                                name="name"
                                value={selectedBodega.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Descripción"
                                name="description"
                                value={selectedBodega.description}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleUpdateBodega}>
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
