import { Link } from "react-router-dom";
import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Material-UI components
import { Button, Typography, Container, Box } from '@mui/material';

// Import the Dashboard component
import Dashboard from './chatbot_components/dashboard';

const Home = () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return (
        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to the Home Page
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                {loggedInUser ? `Hello, ${loggedInUser}!` : "Please log in to access your account."}
            </Typography>
            {!loggedInUser && (
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/login"
                    style={{ marginTop: '1rem' }}
                >
                    Log In
                </Button>
            )}

            {loggedInUser && (
               
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: 3,
                        }}
                    >
                        <Dashboard />
                    </Box>
                
            )}
        </Container>
    );
};

export default Home;