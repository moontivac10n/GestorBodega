// src/pages/Reportes.js
import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

const Reportes = () => {
    const handleExport = (type) => {
        // Aquí puedes implementar la lógica para exportar documentos
        console.log(`Exportando ${type}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h2" gutterBottom>
                Reportes
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Exportar Documentos
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => handleExport('Informe PDF')}>
                                Exportar Informe PDF
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => handleExport('Excel')}>
                                Exportar Excel
                            </Button>
                            <Button variant="contained" color="success" onClick={() => handleExport('CSV')}>
                                Exportar CSV
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Instrucciones
                            </Typography>
                            <Typography variant="body1">
                                Selecciona el tipo de documento que deseas exportar y haz clic en el botón correspondiente.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Reportes;
