// src/pages/Ventas.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        // Simulación de datos de ventas
        const ventasSimuladas = [
            { id: 1, producto: 'Producto X', cantidad: 3, total: '$300', fecha: '2024-11-01' },
            { id: 2, producto: 'Producto Y', cantidad: 1, total: '$150', fecha: '2024-10-30' },
        ];
        setVentas(ventasSimuladas);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Historial de Ventas
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ventas.map((venta) => (
                            <TableRow key={venta.id}>
                                <TableCell>{venta.producto}</TableCell>
                                <TableCell>{venta.cantidad}</TableCell>
                                <TableCell>{venta.total}</TableCell>
                                <TableCell>{venta.fecha}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Ventas;
