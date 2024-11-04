import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/auth/login', formData);
            const { token, userId } = response.data;

            // Guarda el token
            localStorage.setItem('token', token);
            login(token, { id: userId });

            setMessage('Inicio exitoso');
            navigate('/dashboard');

        } catch (error) {
            setMessage(error.response.data.error || 'Error al iniciar sesión');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
            <Typography variant="h4" gutterBottom>
                Iniciar Sesión
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    name="password"
                    fullWidth
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Iniciar Sesión
                </Button>
            </form>
            {message && <p>{message}</p>}
        </Box>
    );
};


export default Login;