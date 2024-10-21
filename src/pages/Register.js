import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        console.log('Registrando usuario:', { username, email, password });
        // Aquí conectarás con el backend para registrar al usuario
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
            <Typography variant="h4" gutterBottom>
                Registrarse
            </Typography>
            <form onSubmit={handleRegister}>
                <TextField
                    label="Nombre de Usuario"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Registrarse
                </Button>
            </form>
        </Box>
    );
};

export default Register;
