import { Link } from "react-router-dom";
import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Material-UI components
import { Button, Typography, Container } from '@mui/material';

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
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/dashboard"
                style={{ marginTop: '1rem' }}
            >
                Go to Dashboard
            </Button>
        </Container>
    );
};

export default Home;
