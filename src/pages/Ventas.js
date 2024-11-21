// CAMBIAR ESTO A TRANSACCIONES, VENTAS SE PUEDE HACER A PARTIR DE ESTA MISMA PAGINA
// O A TRAVES DE OTRO ENDPOINT (OTRA PAGINA)
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Divider,
    TablePagination,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Ventas = () => {
    const { auth } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // State para la paginacion
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:4000/transaction', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });

                // ordenar las transacciones por ID en orden descendente
                const sortedTransactions = response.data.sort((a, b) => b.id - a.id);

                setTransactions(sortedTransactions);
            } catch (err) {
                console.error('Error al obtener las transacciones:', err);
                setError('Error al obtener las transacciones.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [auth.token]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <Typography variant="h6">Cargando transacciones...</Typography>;
    }

    const paginatedTransactions = transactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const translateTransactionType = (type) => {
        if (type === 'sale') return 'Venta';
        if (type === 'purchase') return 'Compra';
        return type;
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Historial de Ventas
            </Typography>
            <Divider style={{ marginBottom: '20px' }} />
            {error && <Typography color="error">{error}</Typography>}
            {transactions.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Inventario</TableCell>
                                    <TableCell>Usuario</TableCell>
                                    <TableCell>Tipo de Transacción</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Costo</TableCell>
                                    <TableCell>Razón</TableCell>
                                    <TableCell>Fecha</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.id}</TableCell>
                                        <TableCell>{transaction.inventory.name}</TableCell>
                                        <TableCell>{transaction.userId}</TableCell>
                                        <TableCell>{translateTransactionType(transaction.transactionType)}</TableCell>
                                        <TableCell>{transaction.quantity}</TableCell>
                                        <TableCell
                                            style={{
                                                color: transaction.transactionCost > 0 ? 'green' : 'red',
                                            }}
                                        >
                                            ${transaction.transactionCost.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{transaction.reason}</TableCell>
                                        <TableCell>
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Paginación */}
                    <TablePagination
                        component="div"
                        count={transactions.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50]}
                        labelRowsPerPage="Filas por página"
                    />
                </>
            ) : (
                <Typography>No hay transacciones disponibles.</Typography>
            )}
        </div>
    );
};

export default Ventas;
