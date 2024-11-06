import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
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
    const { auth } = useAuth();
    const [suppliers, setSuppliers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deletedSupplier, setDeletedSupplier] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', contactName: '', email: '', phone: '', address: '' });
    const [editingSupplier, setEditingSupplier] = useState(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/supplier/', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setSuppliers(response.data);
            } catch (err) {
                console.error("Error al obtener proveedores:", err);
                setError('Error al obtener proveedores');
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, [auth.token]);

    /* luego lo implementare, al ser foranea de otra tabla tengo que ver si hago un DELETE SET
    o implementarle un estado no disponible y que no se muestre en la lista de proovedores
    const handleDelete = (id) => {
        const proveedorEliminado = proveedores.find(proveedor => proveedor.id === id);
        setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
        setDeletedProveedor(proveedorEliminado.nombre);
        setOpenSnackbar(true);
    };
    */

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditingSupplier(null); // Reiniciar selección
    };

    const handleUpdateSupplier = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/supplier/${editingSupplier.id}`, editingSupplier, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setSuppliers(suppliers.map(s => (s.id === editingSupplier.id ? response.data : s)));
            setEditingSupplier(null);
            handleCloseEditModal();
        } catch (err) {
            console.error("Error al actualizar proveedor:", err);
            setError('Error al actualizar proveedor');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingSupplier) {
            setEditingSupplier({ ...editingSupplier, [name]: value });
        } else {
            setNewSupplier({ ...newSupplier, [name]: value });
        }
    };

    const handleCreateSupplier = async () => {
        try {
            const response = await axios.post('http://localhost:4000/supplier/', newSupplier, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setSuppliers([...suppliers, response.data]);
            setNewSupplier({ name: '', contactName: '', email: '', phone: '', address: '' });
            handleCloseModal();
        } catch (err) {
            console.error("Error al crear proveedor:", err);
            setError('Error al crear proveedor');
        }
    };

    if (loading) {
        return <p>Cargando Proveedores...</p>;
    }

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
                            <TableCell>Email</TableCell>
                            <TableCell>Telefono</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body1">No hay Proveedores disponibles</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            suppliers.map((supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell>{supplier.name}</TableCell>
                                    <TableCell>{supplier.contactName}</TableCell>
                                    <TableCell>{supplier.email}</TableCell>
                                    <TableCell>{supplier.phone}</TableCell>
                                    <TableCell>{supplier.address}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => handleOpenEditModal(supplier)} //Logica para desplegar modal
                                        >
                                            Editar
                                        </Button>
                                        <Button variant="contained" color="secondary">
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
                message={`Proveedor ${deletedSupplier} eliminado`}
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
                        placeholder="Nombre"
                        name="name"
                        value={newSupplier.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder="Contacto"
                        name="contactName"
                        value={newSupplier.contactName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder="Correo Electronico"
                        name="email"
                        value={newSupplier.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder="Telefono"
                        name="phone"
                        value={newSupplier.phone}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder="Direccion"
                        name="address"
                        value={newSupplier.address}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateSupplier}>
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
                        Editar Proveedor
                    </Typography>
                    {editingSupplier && (
                        <>
                            <TextField
                                placeholder="Nombre"
                                name="name"
                                value={editingSupplier.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                placeholder="Contacto"
                                name="contactName"
                                value={editingSupplier.contactName}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                placeholder="Correo Electronico"
                                name="email"
                                value={editingSupplier.email}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                placeholder="Telefono"
                                name="phone"
                                value={editingSupplier.phone}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                placeholder="Direccion"
                                name="address"
                                value={editingSupplier.address}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleUpdateSupplier}>
                                Guardar Cambios
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>    
        </div>
    );
};

export default Proveedores;
