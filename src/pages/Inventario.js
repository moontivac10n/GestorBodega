import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Modal, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, Snackbar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Inventario = () => {
    const { auth } = useAuth();
    const [products, setProducts] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [deletedInventory, setDeletedInventory] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editedInventory, setEditedInventory] = useState('');
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [openProductsModal, setOpenProductsModal] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [newInventory, setNewInventory] = useState({ name: '', warehouseId: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inventoriesRes, warehousesRes] = await Promise.all([
                    axios.get('http://localhost:4000/inventory', {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    }),
                    axios.get('http://localhost:4000/warehouse', {
                        headers: { Authorization: `Bearer ${auth.token}` },
                    }),
                ]);
                setInventories(inventoriesRes.data);
                setWarehouses(warehousesRes.data);
            } catch (err) {
                console.error("Error al obtener datos:", err);
                setError('Error al obtener inventarios o almacenes');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [auth.token]);

    const handleOpenModal = () => {
        setNewInventory({
            id: '',
            name: '',
            warehouseId: '',
            });
        setOpenModal(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenEditModal = (inventory) => {
        setNewInventory({
        id: inventory.id,
        name: inventory.name,
        warehouseId: inventory.warehouseId,
        });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedInventory(null); // Reiniciar selección
    };

    const handleOpenAddProductModal = (inventory) => {
        setSelectedInventory(inventory);
        setOpenAddProductModal(true);
    };

    const handleCloseAddProductModal = () => {
        setOpenAddProductModal(false);
        setSelectedInventory(null);
    };

    const handleOpenProductsModal = async (inventory) => {
        setSelectedInventory(inventory);
        await fetchProductsInInventory(inventory.id);
        setOpenProductsModal(true);
    };

    const handleCloseProductsModal = () => {
        setOpenProductsModal(false);
        setSelectedInventory(null);
    };

    const fetchProductsInInventory = async (inventoryId) => {
        try {
            const response = await axios.get(`http://localhost:4000/inventory/${inventoryId}/product`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setProducts(response.data);
        } catch (err) {
            console.error("Error al obtener productos en inventario:", err);
            setError('Error al obtener productos en inventario');
        }
    };

    const handleProductAdded = async (newProduct) => {
        try {
            const existingProduct = products.find(product => product.id === newProduct.id);
            if (existingProduct) {
                const updatedProducts = products.map(product => 
                    product.id === newProduct.id
                        ? { ...product, quantity: product.quantity + newProduct.quantity }
                        : product
                );
                setProducts(updatedProducts);
            } else {
                setProducts((prevProducts) => [...prevProducts, newProduct]);
            }
            handleCloseAddProductModal();
        } catch (err) {
            console.error("Error al agregar producto:", err);
            setError('Error al agregar producto');
            handleCloseAddProductModal();
        }
    };

    const handleCreateInventory = async () => {
        try {
            const response = await axios.post('http://localhost:4000/inventory', newInventory, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            const associatedWarehouse = warehouses.find(warehouse => warehouse.id === newInventory.warehouseId);

            setInventories([...inventories, { ...response.data, warehouse: associatedWarehouse }]);
            setNewInventory({ name: '', warehouseId: '' });
            handleCloseModal();
        } catch (err) {
            console.error("Error al crear inventario:", err);
            setError('Error al crear inventario');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (selectedInventory) {
            setSelectedInventory({ ...selectedInventory, [name]: value });
        } else {
            setNewInventory({ ...newInventory, [name]: value });
        }
    };

    if (loading) {
        return <p>Cargando inventarios...</p>;
    }    

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Inventario
            </Typography>
            <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleOpenModal}>
                Agregar Inventario
            </Button>

            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Bodega</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventories.map((inventory) => (
                            <TableRow key={inventory.id}>
                                <TableCell>{inventory.id}</TableCell>
                                <TableCell>{inventory.name}</TableCell>
                                <TableCell>{inventory.warehouse.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenAddProductModal(inventory)}
                                    >
                                        Agregar Producto
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleOpenProductsModal(inventory)}
                                    >
                                        Ver Productos
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: '10px' }}
                                        onClick={() => handleOpenEditModal(inventory)} //Logica para desplegar modal
                                    >
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar para eliminar inventario */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Inventario ${deletedInventory} eliminado`}
            />

            {/* Snackbar para editar inventario */}
            <Snackbar
                open={!!editedInventory}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={`Inventario ${editedInventory} editado`}
            />    

            {/* Modal para agregar inventario */}
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
                        Agregar Inventario
                    </Typography>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={newInventory.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Bodega</InputLabel>
                        <Select
                        label="Bodega"
                        name="warehouseId"
                        value={newInventory.warehouseId}
                        onChange={handleInputChange}
                        >
                        {warehouses.map((warehouse) => (
                            <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleCreateInventory}>
                        Agregar
                    </Button>
                </Box>
            </Modal>

            {/* Modal para agregar productos */}
            <Modal open={openAddProductModal} onClose={handleCloseAddProductModal}>
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
                    <AddProductForm
                        inventoryId={selectedInventory?.id}
                        authToken={auth.token}
                        onProductAdded={handleProductAdded}
                        fetchProductsInInventory={fetchProductsInInventory}
                        handleCloseAddProductModal={handleCloseAddProductModal}
                    />
                </Box>
            </Modal>

            {/* Modal para ver productos */}
            <Modal open={openProductsModal} onClose={handleCloseProductsModal}>
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
                        Productos en el Inventario: {selectedInventory?.name}
                    </Typography>
                    {products.length > 0 ? (
                        <List>
                            {products.map((product) => (
                                <ListItem key={product.id}>
                                    <ListItemText
                                        primary={product.product.name}
                                        secondary={`Stock: ${product.quantity}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No hay productos en este inventario.</Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseProductsModal}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

const AddProductForm = ({ inventoryId, authToken, onProductAdded, fetchProductsInInventory, handleCloseAddProductModal }) => {
    const [productsList, setProductsList] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [transactionType, setTransactionType] = useState('purchase');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/product', {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setProductsList(response.data);
            } catch (err) {
                console.error("Error al obtener productos:", err);
                setError('Error al obtener lista de productos');
            }
        };
        fetchProducts();
    }, [authToken]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!selectedProductId || quantity <= 0) {
            setError("Seleccione un producto y una cantidad válida.");
            return;
        }

        try {
            const inventoryResponse = await axios.post(
                `http://localhost:4000/inventory/${inventoryId}/product`,
                {
                    productId: parseInt(selectedProductId),
                    quantity: quantity,
                    transactionType,
                },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            console.log("Inventario actualizado:", inventoryResponse.data);

            const transactionData = {
                productId: parseInt(selectedProductId),
                quantity: quantity,
                transactionType,
                inventoryId,
                userId: 1, // Placeholder for actual user ID
            };

            const response = await axios.post(
                `http://localhost:4000/transaction`,
                transactionData,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            console.log("Transacción exitosa:", response.data);
            onProductAdded(response.data);
            fetchProductsInInventory(inventoryId); // Refresh inventory
            handleCloseAddProductModal();
        } catch (err) {
            console.error("Error al agregar producto:", err);
            setError("Error al agregar el producto.");
            handleCloseAddProductModal();
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Agregar Producto al Inventario
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleAddProduct}>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="product-select-label">Producto</InputLabel>
                    <Select
                        labelId="product-select-label"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        {productsList.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Cantidad"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                />
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="transaction-type-label">Tipo de Transacción</InputLabel>
                    <Select
                        labelId="transaction-type-label"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <MenuItem value="purchase">Compra</MenuItem>
                        <MenuItem value="sale">Venta</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" type="submit">
                    Agregar Producto
                </Button>
            </form>
        </Box>
    );
};

export default Inventario;
