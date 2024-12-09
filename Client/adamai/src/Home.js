import { Link } from "react-router-dom";
import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Material-UI components
import { Button, Typography, Container, Box } from '@mui/material';

// Import the Dashboard component
import Dashboard from './chatbot_components/dashboard';

import ViewPdfs from "./pdf_components/viewPdfs";

const Home = () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return (
        <Container maxWidth="xl" style={{ textAlign: 'center', marginTop: '2rem' }}>
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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginTop: '2rem',
                        gap: '1rem'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: 'white',
                            borderRadius: '3px',
                            padding: '7px',
                            boxShadow: 3,
                            minWidth: '45%'
                        }}
                    >
                        <Dashboard />
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: 'white',
                            borderRadius: '3px',
                            padding: '7px',
                            boxShadow: 3,
                            minWidth: '45%'
                        }}
                    >
                        <ViewPdfs />
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Home;