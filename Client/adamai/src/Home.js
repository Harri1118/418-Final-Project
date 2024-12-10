import { Link } from "react-router-dom";
import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image from './Images/convert.png';

// Import Material-UI components
import { Button, Typography, Container, Box } from '@mui/material';

// Import the Dashboard component
import Dashboard from './chatbot_components/dashboard';

import ViewPdfs from "./pdf_components/viewPdfs";

const Home = () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return (
        <Container 
        maxWidth="xl" style={{ textAlign: 'center', marginTop: '2rem',
        padding: '3rem 0', minHeight:'100vh', color:'#fff', position:'relative'
    }} 
        >
            <Typography variant="h3" component="h1" gutterBottom sx={{
                fontWeight: 'bold', background: 'linear-gradient(to right, #FF5F6D, #FFC371)',
                padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                WebkitBackgroundClip: 'text', color:'transparent',
            }}>
                Welcome to the Home Page
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{
                marginTop:'1rem', fontSize: '1.2rem', color: "black"
            }}>
                {loggedInUser ? `Hello, ${loggedInUser}!` : "Please Log in to Access your Account."}
            </Typography> 



            {!loggedInUser && (
                <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/login"
                    sx = {{
                        marginTop: '2rem',
                        padding: '15px, 20px',
                        fontSize: '1.3rem',
                        borderRadius: '35px',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                        '&:hover':{
                            backgroundColor:'#FF5F6D', 
                            transform:'scale(1.05)',
                        },
                    }}
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
                        marginTop: '3rem',
                        gap: '1.7rem',
                        flexWrap:'wrap'
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: 'linear-gradient(to right, #6a11cb, #2575fc)',
                            borderRadius: '14px',
                            padding: '20px',
                            boxShadow: '0 4px 25px rgba(0,0,0,0.2)',
                            minWidth: '45%',
                            color:'#fff',
                            transition: 'transform 0.3s ease',
                            '&:hover':{
                                transform:'sacle(1.05)',
                            }
                        }}
                    >
                        <Typography variant="h5" sx={{fontWeight:'bold'}}>
                            Your DashBoard
                        </Typography>
                        <Dashboard />
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: 'linear-gradient(to left,#ff7e5f,#feb47b)',
                            borderRadius: '11px',
                            padding: '20px',
                            boxShadow: '0 4px 25px rgba(0,0,0,0.2)',
                            minWidth: '45%',
                            color:'#fff',
                            transition: 'transform 0.3s ease',
                            '&:hover':{
                                transform:'scale(1.05)',
                            },
                        }}
                    >
                        <Typography variant="h5" sx={{fontWeight:'bold'}}>
                            View PDFs
                        </Typography>
                        <ViewPdfs />
                    </Box>
                </Box>
            )}
            <Box>
                <img src = {image} alt="UA"style={{
                        width: '150px',
                        height: 'auto',
                    }}/>
            </Box>
        </Container>
    );
};

export default Home;
