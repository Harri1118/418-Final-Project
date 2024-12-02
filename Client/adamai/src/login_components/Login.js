import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Button,
    TextField,
    Typography,
    Box,
    Container,
    Alert,
} from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // To handle error messages
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        setError(null); // Reset any previous error

        axios
            .get('http://localhost:9000/getUser', { params: { username, password } })
            .then((res) => {
                if (res.data) {
                    alert('Login Successful');
                    localStorage.setItem('loggedInUser', username);
                    setUsername('');
                    setPassword('');
                    navigate('/');
                } else {
                    setError('Wrong Credentials');
                }
            })
            .catch(() => {
                setError('Error in Login. Please try again later.');
            });
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Log In
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    No account?{' '}
                    <Link to="/Signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
                        Signup
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
