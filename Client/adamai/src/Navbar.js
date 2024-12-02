import React from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material"; // Import MUI components
import adamaiLogo from "./images/adamai_logo.jpg"; // Import the logo image

export default function Navbar() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const hasPurchased = localStorage.getItem('hasPurchased');
    const navigate = useNavigate();

    const handleSignOut = (event) => {
        event.preventDefault();
        localStorage.clear();
        navigate("/Login");
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
            <Toolbar>
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <img
                        src={adamaiLogo}
                        alt="AdamAI Logo"
                        style={{
                            width: "50px",
                            height: "50px",
                            marginRight: "10px",
                            borderRadius: "50%", // Optional: makes the logo circular
                        }}
                    />
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        ADAM.AI
                    </Typography>
                </Box>
                <Box>
                    <CustomLink to="/">Home</CustomLink>
                    {!hasPurchased && (
                        <CustomLink to="/Login">Subscribe</CustomLink>
                    )}
                    {loggedInUser ? (
                        <CustomLink to="/CreateChatbot">Create</CustomLink>
                    ) : (
                        <CustomLink to="/Login">Create</CustomLink>
                    )}
                    {!loggedInUser && (
                        <CustomLink to="/">My Account</CustomLink>
                    )}
                    {loggedInUser ? (
                        <CustomLink to="/" onClick={handleSignOut}>
                            Sign Out
                        </CustomLink>
                    ) : (
                        <CustomLink to="/Login">Log In</CustomLink>
                    )}
                    {loggedInUser && (
                        <CustomLink to="/Signup">Sign Up</CustomLink>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <Button
            component={Link}
            to={to}
            {...props}
            variant="text"
            style={{
                textTransform: "none",
                color: isActive ? "white" : "inherit",
                marginRight: "1rem",
            }}
        >
            {children}
        </Button>
    );
}
