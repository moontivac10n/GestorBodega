// Implementado lo de crear usuarios, falta ocultar vista para los que no son administradores y
// arreglar un pequeño bug que al momento de crear usuario no se refleja en el front al instante
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Modal, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Usuarios = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', full_name: '', company_id: '', roleId: '', statusId: '' });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [rolesRes, statusesRes] = await Promise.all([
                axios.get('http://localhost:4000/role', { headers: { Authorization: `Bearer ${auth.token}` } }),
                axios.get('http://localhost:4000/status', { headers: { Authorization: `Bearer ${auth.token}` } }),
                ]);
                setRoles(rolesRes.data);
                setStatuses(statusesRes.data);
            } catch (err) {
                console.error("Error al obtener opciones:", err);
                setError('Error al cargar las opciones');
            }
            };
            fetchOptions();
        }, [auth.token]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/user/', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
                setError('Error al obtener usuarios');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [auth.token]);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
            setNewUser({ ...newUser, [name]: value });
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post('http://localhost:4000/company/createUser', newUser, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            setUsers([...users, response.data]);
            setNewUser({ username: '', email: '', password: '', full_name: '', company_id: 1, roleId: '', statusId: '' });
            handleCloseModal();
        } catch (err) {
            console.error("Error al crear usuario:", err);
            setError('Error al crear usuario');
        }
    };

    const handleDelete = (id) => {
        console.log(`Usuario con id ${id} eliminado`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Gestión de Usuarios
            </Typography>
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleOpenModal}>
                Agregar Usuario
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.full_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role?.name || 'Sin rol'}</TableCell>
                                <TableCell>{user.status?.name || 'Sin estado'}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                        Editar
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(user.id)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

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
                        Agregar Usuario
                    </Typography>
                    <TextField
                        placeholder="Usuario"
                        name="username"
                        value={newUser.username}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder="Correo Electronico"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder="Contraseña"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        placeholder="Nombre Completo"
                        name="full_name"
                        value={newUser.full_name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Rol</InputLabel>
                        <Select
                        label="Rol"
                        name="roleId"
                        value={newUser.roleId}
                        onChange={handleInputChange}
                        >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Estado</InputLabel>
                        <Select
                        label="Estado"
                        name="statusId"
                        value={newUser.statusId}
                        onChange={handleInputChange}
                        >
                        {statuses.map((status) => (
                            <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleCreateUser}>
                        Agregar
                    </Button>
                </Box>
            </Modal>

            </TableContainer>
        </div>
    );
};

export default Usuarios;
