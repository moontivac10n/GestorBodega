// src/pages/Proveedores.js
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Snackbar,
    Modal,
    TextField,
    Box,
} from '@mui/material';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deletedProveedor, setDeletedProveedor] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [newProveedor, setNewProveedor] = useState({ nombre: '', contacto: '' });

    useEffect(() => {
        // Simulación de datos de proveedores
        const proveedoresSimulados = [
            { id: 1, nombre: 'Proveedor A', contacto: 'contactoA@mail.com' },
            { id: 2, nombre: 'Proveedor B', contacto: 'contactoB@mail.com' },
        ];
        setProveedores(proveedoresSimulados);
    }, []);

    const handleDelete = (id) => {
        const proveedorEliminado = proveedores.find(proveedor => proveedor.id === id);
        setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
        setDeletedProveedor(proveedorEliminado.nombre);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProveedor({ ...newProveedor, [name]: value });
    };

    const handleAddProveedor = () => {
        const id = proveedores.length ? proveedores[proveedores.length - 1].id + 1 : 1; // Generar un nuevo ID
        setProveedores([...proveedores, { id, ...newProveedor }]);
        setNewProveedor({ nombre: '', contacto: '' }); // Reiniciar el formulario
        handleCloseModal();
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Gestión de Proveedores
            </Typography>
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleOpenModal}>
                Agregar Proveedor
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Contacto</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {proveedores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body1">No hay proveedores disponibles</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            proveedores.map((proveedor) => (
                                <TableRow key={proveedor.id}>
                                    <TableCell>{proveedor.nombre}</TableCell>
                                    <TableCell>{proveedor.contacto}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                                            Editar
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(proveedor.id)}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Proveedor ${deletedProveedor} eliminado`}
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
                        Agregar Proveedor
                    </Typography>
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={newProveedor.nombre}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Contacto"
                        name="contacto"
                        value={newProveedor.contacto}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleAddProveedor}>
                        Agregar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Proveedores;
