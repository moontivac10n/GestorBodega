import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Modal, Snackbar
} from '@mui/material';

const Categorias = () => {
    const { auth } = useAuth();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [deletedCategory, setDeletedCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:4000/category/', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };
        fetchCategories();
    }, [auth.token]);

    // Handle open and close modals
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenEditModal = (category) => {
        setSelectedCategory(category);
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedCategory(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (selectedCategory) {
            setSelectedCategory({ ...selectedCategory, [name]: value });
        } else {
            setNewCategory({ ...newCategory, [name]: value });
        }
    };

    const handleCreateCategory = async () => {
        try {
            const response = await axios.post('http://localhost:4000/category/', newCategory, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setCategories([...categories, response.data]);
            setNewCategory({ name: '', description: '' });
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear categoría:", error);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/category/${selectedCategory.id}`, selectedCategory, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setCategories(categories.map(cat => (cat.id === selectedCategory.id ? response.data : cat)));
            setEditedCategory(response.data.name);
            setSelectedCategory(null);
            handleCloseEditModal();
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const categoryToDelete = categories.find((category) => category.id === id);
            await axios.delete(`http://localhost:4000/category/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setCategories(categories.filter((category) => category.id !== id));
            setDeletedCategory(categoryToDelete.name);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Categorías
            </Typography>

            {/* Button to open the modal for creating a new category */}
            <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ marginBottom: 2 }}>
                Agregar Categoría
            </Button>

            {/* Categories table */}
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Descripcion</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginRight: 1 }}
                                            onClick={() => handleOpenEditModal(category)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography>No se encontraron categorías</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar for category deletion */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Categoría ${deletedCategory} eliminada`}
            />

            <Snackbar
                open={!!editedCategory} // Show snackbar if a category was edited
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Categoría ${editedCategory} actualizada`}
            />

            {/* Modal to create a new category */}
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
                        Agregar Categoría
                    </Typography>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={newCategory.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Descripción"
                        name="description"
                        value={newCategory.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleCreateCategory}>
                        Crear Categoría
                    </Button>
                </Box>
            </Modal>

            {/* Modal to edit an existing category */}
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
                        Editar Categoría
                    </Typography>
                    {selectedCategory && (
                        <>
                            <TextField
                                label="Nombre"
                                name="name"
                                value={selectedCategory.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Descripción"
                                name="description"
                                value={selectedCategory.description}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleUpdateCategory}>
                                Guardar Cambios
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Categorias;
