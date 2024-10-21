import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid2 } from '@mui/material';
import { People, Inventory, ShoppingCart } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [transaccionesCount, setTransaccionesCount] = useState(0);

  useEffect(() => {
    // Simulación de obtención de datos del backend
    const fetchData = async () => {
      try {
        // Aquí puedes hacer tus peticiones a la API
        // Simulación de datos
        setUsuariosCount(100); // Reemplaza con la respuesta real
        setProductosCount(500); // Reemplaza con la respuesta real
        setTransaccionesCount(25); // Reemplaza con la respuesta real

        // Datos de stock (ejemplo)
        const data = [
          { name: 'Producto 1', value: 400 },
          { name: 'Producto 2', value: 300 },
          { name: 'Producto 3', value: 300 },
          { name: 'Producto 4', value: 200 },
        ];
        setStockData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h2" gutterBottom color="primary">
        Panel de Control
      </Typography>
      <Grid2 container spacing={3}>
        <Grid2 item xs={12} md={4}>
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
        </Grid2>
        <Grid2 item xs={12} md={4}>
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
        </Grid2>
        <Grid2 item xs={12} md={4}>
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
        </Grid2>
      </Grid2>

      {/* Gráfico de Distribución de Stock */}
      <div style={{ marginTop: '40px' }}>
        <Typography variant="h4" gutterBottom>
          Distribución de Stock
        </Typography>
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
            {stockData.map((_entry, index) => (
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
