import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Categorias = () => {
    const { auth } = useAuth();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editingCategory, setEditingCategory] = useState(null);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingCategory) {
            setEditingCategory({ ...editingCategory, [name]: value });
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
        } catch (error) {
            console.error("Error al crear categoría:", error);
        }
    };

    // Filtrar categorias basado en el término de búsqueda
    //const categoriasFiltrados = categorias.filter((categoria) =>
    //    categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
    //);

    const handleUpdateCategory = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/category/${editingCategory.id}`, editingCategory, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
            setEditingCategory(null);
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
        }
    };

    /*
    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/category/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
        }
    };
    */

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Categorías
            </Typography>

            {/* Campo de búsqueda */}
            {/* <TextField
                label="Buscar categoria"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />*/}

            <TextField
                placeholder="Nombre de la Categoría"
                fullWidth
                margin="normal"
                type='text'
                name='name'
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={handleInputChange}
            />
            <TextField
                placeholder="Descripcion de la Categoría"
                fullWidth
                margin="normal"
                type='text'
                name='description'
                value={editingCategory ? editingCategory.description : newCategory.description}
                onChange={handleInputChange}
            />
            
            <Button variant="contained" color="primary" fullWidth onClick={handleCreateCategory}>
                Agregar Categoría
            </Button>

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
                                        <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                            Editar
                                        </Button>
                                        <Button variant="contained" color="secondary">
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography>No se encontraron productos</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Categorias;
