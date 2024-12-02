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

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // To handle error messages

    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError(null); // Reset any previous error

        try {
            await axios.post('http://localhost:9000/createUser', {
                firstName,
                lastName,
                username,
                password,
            });
            alert(`Registration Successful. Welcome ${firstName}, please log in!`);
            navigate('/Login');
        } catch (err) {
            setError(`Error in Signing Up: ${err.response ? err.response.data : err.message}`);
        }
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
                    Sign Up
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSignUp} sx={{ width: '100%' }}>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
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
                        Sign Up
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Return to{' '}
                    <Link to="/Login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                        Login
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignUp;
