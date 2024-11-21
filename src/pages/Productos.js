import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import useFetchUserDetails from '../hooks/useFetchUserDetails';
import {
    TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Snackbar, Modal, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';

const Productos = () => {
    const { auth } = useAuth();
    const [products, setProducts] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deletedProduct, setDeletedProduct] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        id: '',
        name: '',
        description: '',
        sku: '',
        price: '',
        priceSell: '',
        categoryId: '',
        supplierId: '',
        statusId: '',
        image_url: '',
    });
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [error, setError] = useState(null);

    const { userDetails, loading, error: userError } = useFetchUserDetails(auth.user.id, auth.token);

    useEffect(() => {
        const fetchOptions = async () => {
        try {
            const [categoriesRes, suppliersRes, statusesRes] = await Promise.all([
            axios.get('http://localhost:4000/category', { headers: { Authorization: `Bearer ${auth.token}` } }),
            axios.get('http://localhost:4000/supplier', { headers: { Authorization: `Bearer ${auth.token}` } }),
            axios.get('http://localhost:4000/status', { headers: { Authorization: `Bearer ${auth.token}` } }),
            ]);
            setCategories(categoriesRes.data);
            setSuppliers(suppliersRes.data);
            setStatuses(statusesRes.data);
        } catch (err) {
            console.error("Error al obtener opciones:", err);
            setError('Error al cargar las opciones');
        }
        };
        fetchOptions();
    }, [auth.token]);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:4000/product', {
            headers: { Authorization: `Bearer ${auth.token}` },
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Error al obtener productos:", err);
            setError('Error al cargar los productos');
        }
        };
        fetchProducts();
    }, [auth.token]);

    const handleOpenModal = () => {
        setNewProduct({
        id: '',
        name: '',
        description: '',
        sku: '',
        price: '',
        priceSell: '',
        categoryId: '',
        supplierId: '',
        statusId: '',
        image_url: '',
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenEditModal = (product) => {
        setNewProduct({
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.sku,
        price: product.price.toString(),
        priceSell: product.priceSell.toString(),
        categoryId: product.categoryId.toString(),
        supplierId: product.supplierId.toString(),
        statusId: product.statusId.toString(),
        image_url: product.image_url,
        });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateOrUpdateProduct = async () => {
        // Validación de campos
        if (!newProduct.name || !newProduct.price || !newProduct.priceSell || !newProduct.categoryId || !newProduct.supplierId || !newProduct.statusId) {
        setError('Por favor, complete todos los campos requeridos.');
        return;
        }

        const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        priceSell: parseFloat(newProduct.priceSell),
        categoryId: parseInt(newProduct.categoryId, 10),
        supplierId: parseInt(newProduct.supplierId, 10),
        statusId: parseInt(newProduct.statusId, 10),
        companyId: userDetails?.companyId,
        };

    try {
        let res;
        if (newProduct.id) {
            // Actualizar producto
            res = await axios.put(`http://localhost:4000/product/${newProduct.id}`, productData, {
            headers: { Authorization: `Bearer ${auth.token}` },
            });
        } else {
            // Crear nuevo producto
            res = await axios.post('http://localhost:4000/product', productData, {
            headers: { Authorization: `Bearer ${auth.token}` },
            });
        }

        setNewProduct({
            id: '',
            name: '',
            description: '',
            sku: '',
            price: '',
            priceSell: '',
            categoryId: '',
            supplierId: '',
            statusId: '',
            image_url: '',
        });

        const productsRes = await axios.get('http://localhost:4000/product', {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        setProducts(productsRes.data);
        handleCloseModal();
        handleCloseEditModal();
        } catch (err) {
        console.error("Error al crear o actualizar producto:", err);
        setError('Error al procesar el producto');
        }
    };

    const handleDelete = async (id) => {
        try {
        const productToDelete = products.find((product) => product.id === id);
        await axios.delete(`http://localhost:4000/product/${id}`, {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        setProducts(products.filter((product) => product.id !== id));
        setDeletedProduct(productToDelete.name);
        setOpenSnackbar(true);
        } catch (error) {
        console.error("Error al eliminar producto:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>Gestión de Productos</Typography>

        <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleOpenModal}>
            Agregar Producto
        </Button>

        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Precio de Venta</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Acciones</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {products.length > 0 ? (
                products.map((product) => (
                    <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>${product.priceSell}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.supplier.name}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => handleOpenEditModal(product)}>Editar</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={6}><Typography>Cargando Productos...</Typography></TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </TableContainer>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={`Producto ${deletedProduct} eliminado`} />

        {/* Modal de creación/edición */}
        <Modal open={openModal || openEditModal} onClose={handleCloseModal}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography variant="h6" gutterBottom>{newProduct.id ? 'Editar Producto' : 'Agregar Producto'}</Typography>
            
            <TextField label="Nombre" name="name" value={newProduct.name} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Descripción" name="description" value={newProduct.description} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="SKU" name="sku" value={newProduct.sku} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Precio" name="price" value={newProduct.price} onChange={handleInputChange} fullWidth margin="normal" />
            <TextField label="Precio de Venta" name="priceSell" value={newProduct.priceSell} onChange={handleInputChange} fullWidth margin="normal" />

            {/* Select para Categoría */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Categoria</InputLabel>
                <Select
                label="Categoria"
                name="categoryId"
                value={newProduct.categoryId}
                onChange={handleInputChange}
                >
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
                </Select>
            </FormControl>

            {/* Select para Proveedor */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Proveedor</InputLabel>
                <Select
                label="Proveedor"
                name="supplierId"
                value={newProduct.supplierId}
                onChange={handleInputChange}
                >
                {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>
                ))}
                </Select>
            </FormControl>

            {/* Select para Estado */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                label="Estado"
                name="statusId"
                value={newProduct.statusId}
                onChange={handleInputChange}
                >
                {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
                ))}
                </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={handleCreateOrUpdateProduct}>
                {newProduct.id ? 'Guardar Cambios' : 'Agregar'}
            </Button>
            </Box>
        </Modal>
        </Box>
    );
};

export default Productos;
