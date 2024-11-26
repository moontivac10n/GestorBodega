import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { People, Inventory, BarChart as BarChartIcon, MonetizationOn, TrendingUp, CalendarToday } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Analisis = () => {
    const { auth } = useAuth();
    const [analysisData, setAnalysisData] = useState(null);
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para cargar datos del backend
    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const [analisisRes, stockRes] = await Promise.all([
                axios.get('http://localhost:4000/analysis/analyze-transactions', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }),
                axios.get('http://localhost:4000/analysis/analyze-stock', {
                    headers: { Authorization: `Bearer ${auth.token}` },
                }),
            ]);

            const parsedData = JSON.parse(analisisRes.data.summary); // Parsear la cadena JSON
            const parsedStock = JSON.parse(stockRes.data.summary);
            setAnalysisData(parsedData); // Establecer los datos analizados en el estado
            setStockData(parsedStock);
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
                        {/* Resumen de Total Purchase, Total Sales y Balance */}
                        <Grid item xs={12} md={4}>
                            <Card style={{ backgroundColor: '#f0f4c3' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <MonetizationOn fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Resumen Financiero
                                        </Typography>
                                    </div>
                                    <Typography variant="h6" color="warning">
                                        Total Compras: <strong>$-{analysisData.total_purchase.toFixed(2)}</strong>
                                    </Typography>
                                    <Typography variant="h6" color="green">
                                        Total Ventas: <strong>${analysisData.total_sales.toFixed(2)}</strong>
                                    </Typography>
                                    <Typography variant="h6">
                                        Balance: <strong>${analysisData.balance.toFixed(2)}</strong>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Ganancias por Producto */}
                        <Grid item xs={12} md={4}>
                            <Card style={{ backgroundColor: '#e3f2fd' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <People fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Posible Ganancia según el Stock
                                        </Typography>
                                    </div>
                                    {analysisData.profit_summary && analysisData.profit_summary.map((item, index) => (
                                        <Typography variant="h6" key={index}>
                                            Producto <strong>{item.productName}:</strong> {item.total_profit}
                                        </Typography>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Resumen de Categorías */}
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
                                            Categoría <strong>{category.categoryName}:</strong> Ventas = {category.total_sales}, Ganancia = {category.total_profit}
                                        </Typography>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Productos con Bajo Stock */}
                        <Grid item xs={12} md={4}>
                            <Card style={{ backgroundColor: '#fff3e0' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <BarChartIcon fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Productos con Bajo Stock
                                        </Typography>
                                    </div>
                                    {stockData.low_stock && stockData.low_stock.length > 0 ? (
                                        stockData.low_stock.map((product, index) => (
                                            <Alert key={index} severity="warning" style={{ marginBottom: '10px' }}>
                                                Producto <strong>{product.productName}</strong> del Inventario <strong>{product.inventoryName}</strong> tiene bajo stock. <strong>({product.quantity} unidades de {product.minimumQuantity} unidades mínimas)</strong>
                                            </Alert>
                                        ))
                                    ) : (
                                        <Typography variant="body1">No hay productos con bajo stock.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Productos con Mayor Demanda */}
                        <Grid item xs={12} md={6}>
                            <Card style={{ backgroundColor: '#e8f5e9' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <TrendingUp fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Productos con Mayor Demanda
                                        </Typography>
                                    </div>
                                    {analysisData.top_demand_products && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                data={analysisData.top_demand_products.map((product) => ({
                                                    name: product.productName,
                                                    ventas: product.total_quantity_sold,
                                                }))}
                                                margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                                            >
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="ventas" fill="#82ca9d" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Promedio de Ventas por Día */}
                        <Grid item xs={12} md={6}>
                            <Card style={{ backgroundColor: '#f1f8e9' }}>
                                <CardContent>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday fontSize="large" color="primary" />
                                        <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                                            Promedio de Ventas por Día de la Semana
                                        </Typography>
                                    </div>
                                    {analysisData.average_sales_per_day && (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart
                                                data={analysisData.average_sales_per_day.map((day) => ({
                                                    name: day.day_of_week,
                                                    promedio: day.average_sales.toFixed(2),
                                                }))}
                                                margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                                            >
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="promedio" fill="#4caf50" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                    {/* Otros graficos o secciones */}
                    </Grid>
                </>
            )}
        </div>
    );
};

export default Analisis;
