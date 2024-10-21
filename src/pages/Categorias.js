import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Categorias = () => {
    const [categorias, setCategorias] = useState([{ id: 1, name: 'Electrónica' }]);
    const [newCategoria, setNewCategoria] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    const handleAgregar = () => {
        const id = categorias.length + 1;
        setCategorias([...categorias, { id, name: newCategoria }]);
        setNewCategoria('');
    };


    // Filtrar categorias basado en el término de búsqueda
    const categoriasFiltrados = categorias.filter((categoria) =>
        categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        console.log(`Categoria con id ${id} eliminado`);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Categorías
            </Typography>

            {/* Campo de búsqueda */}
            <TextField
                label="Buscar categoria"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <TextField
                label="Nombre de la Categoría"
                fullWidth
                margin="normal"
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleAgregar}>
                Agregar Categoría
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoriasFiltrados.length > 0 ? (
                            categoriasFiltrados.map((categoria) => (
                                <TableRow key={categoria.id}>
                                    <TableCell>{categoria.id}</TableCell>
                                    <TableCell>{categoria.name}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                            Editar
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleDelete(categoria.id)}>
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
