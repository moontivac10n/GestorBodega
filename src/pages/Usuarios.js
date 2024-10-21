import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                // simulacion de datos mientras el backend no esta conectado
                const dataSimulada = [
                    { id: 1, username: 'usuario1', email: 'usuario1@mail.com', role: 'admin' },
                    { id: 2, username: 'usuario2', email: 'usuario2@mail.com', role: 'user' },
                ];
                setUsuarios(dataSimulada);

                //descomentar esto cuando el backend este listo
                /*
                const response = await fetch('/api/usuarios');
                if (!response.ok) {
                  throw new Error('Error al obtener usuarios');
                }
                const data = await response.json();
                setUsuarios(data);
                */
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };
        obtenerUsuarios();
    }, []);

    const handleDelete = (id) => {
        console.log(`Usuario con id ${id} eliminado`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Gestión de Usuarios
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.username}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>{usuario.role}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                        Editar
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(usuario.id)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Usuarios;
