import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Alert } from '@mui/material';
import { People, Inventory, ShoppingCart } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Analisis from './Analisis';
import { useAuth } from '../context/AuthContext';
import useFetchUserDetails from '../hooks/useFetchUserDetails';

const Dashboard = () => {
  const { auth } = useAuth();
  const userId = auth.user?.id; 
  const token = localStorage.getItem('token');
  const [stockData, setStockData] = useState([]);
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [transaccionesCount, setTransaccionesCount] = useState(0);



  const { userDetails, loading, error } = useFetchUserDetails(userId, token);

  useEffect(() => {
    // Simulación de obtención de datos del backend
    const fetchData = async () => {
      try {
        // Simulación de datos
        setUsuariosCount(5); // Reemplaza con la respuesta real
        setProductosCount(500); // Reemplaza con la respuesta real
        setTransaccionesCount(25); // Reemplaza con la respuesta real

        // Datos de stock (ejemplo)
        const data = [
          { name: 'Producto 1', value: 400 },
          { name: 'Producto 2', value: 50 },
          { name: 'Producto 3', value: 300 },
          { name: 'Producto 4', value: 20 }, // Este producto tiene bajo stock
        ];
        setStockData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const isAdmin = userDetails?.role?.name === "Admin";

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h2" gutterBottom color="primary">
        Panel de Control
      </Typography>
      <Grid container spacing={3}>
        {/* Tarjeta de Usuarios */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <People fontSize="large" color="primary" />
                <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                  Total Usuarios
                </Typography>
              </div>
              <Typography variant="h2" color="primary">
                {usuariosCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Tarjeta de Inventario */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#e1f5fe' }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Inventory fontSize="large" color="primary" />
                <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                  Inventario Total
                </Typography>
              </div>
              <Typography variant="h2" color="primary">
                {productosCount} productos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Tarjeta de Transacciones */}
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: '#fff3e0' }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCart fontSize="large" color="primary" />
                <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
                  Transacciones Recientes
                </Typography>
              </div>
              <Typography variant="h2" color="primary">
                {transaccionesCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mostrar Analisis solo si el usuario es Admin */}
      {isAdmin && <Analisis />}
      
      <Typography variant="h4" marginTop={5} textAlign={'center'} gutterBottom>
        Distribución de Stock
      </Typography>
      {/* Gráfico de Distribución de Stock */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
        <PieChart width={400} height={400}>
          <Pie
            data={stockData}
            cx={200}
            cy={200}
            labelLine={false}
            label={entry => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {stockData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
