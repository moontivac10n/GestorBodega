import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Alert } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { People, Inventory, BarChart } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Analisis = () => {
    const { auth } = useAuth();
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0'];

    // Función para cargar datos del backend
    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:4000/analysis/analyze-transactions', {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
    
            const parsedData = JSON.parse(response.data.summary); // Parsear la cadena JSON
            console.log(parsedData); // Ver los datos parseados
            setAnalysisData(parsedData); // Establecer los datos analizados en el estado
        } catch (err) {
            setError('Error al cargar el análisis. Intenta nuevamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Typography variant="h2" gutterBottom color="primary">
                Análisis de Transacciones
            </Typography>

            {loading && <Typography variant="h6">Cargando análisis...</Typography>}
            {error && (
                <Alert severity="error" style={{ marginBottom: '20px' }}>
                    {error}
                </Alert>
            )}

            {analysisData && (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card style={{ backgroundColor: '#e3f2fd' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <People fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Productos con Mayor Ganancia
                                        </Typography>
                                    </div>
                                    {analysisData.profit_summary && analysisData.profit_summary.map((item, index) => (
                                        <Typography variant="h6" key={index}>
                                            Producto {item.productId}: {item.profit}
                                        </Typography>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card style={{ backgroundColor: '#e1f5fe' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Inventory fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Resumen de Categorías
                                        </Typography>
                                    </div>
                                    {analysisData.category_summary && analysisData.category_summary.map((category, index) => (
                                        <Typography variant="h6" key={index}>
                                            Categoría {category.categoryId}: Ventas = {category.total_sales}, Ganancia = {category.total_profit}
                                        </Typography>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card style={{ backgroundColor: '#fff3e0' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <BarChart fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Productos con Bajo Stock
                                        </Typography>
                                    </div>
                                    {analysisData.low_stock && analysisData.low_stock.length > 0 ? (
                                        analysisData.low_stock.map((product, index) => (
                                            <Alert key={index} severity="warning" style={{ marginBottom: '10px' }}>
                                                Producto {product.productId} tiene bajo stock ({product.quantity} unidades)
                                            </Alert>
                                        ))
                                    ) : (
                                        <Typography variant="body1">No hay productos con bajo stock.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </div>
    );
};

export default Analisis;
