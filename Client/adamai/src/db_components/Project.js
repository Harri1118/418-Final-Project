import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const Project = () => {
    const { projId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch project data based on projId
    useEffect(() => {
        axios
            .get(`http://localhost:9000/projects/${projId}`)
            .then((response) => {
                setProjectData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching project data:', err);
                setError('Failed to load project data.');
                setLoading(false);
            });
    }, [projId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '800px', margin: 'auto', mt: 5, padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {projectData.name}
            </Typography>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Description:
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {projectData.description}
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Owner:
                </Typography>
                <Typography variant="body1">{projectData.owner}</Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Team Members:
                </Typography>
                {projectData.teamMembers.length > 0 ? (
                    <ul>
                        {projectData.teamMembers.map((member, index) => (
                            <li key={index}>
                                <Typography variant="body1">{member}</Typography>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography variant="body1">No team members assigned.</Typography>
                )}
            </Paper>

            <Button
                variant="contained"
                color="primary"
                onClick={() => console.log('Edit project')}
                sx={{ marginRight: 2 }}
            >
                Edit Project
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={() => console.log('Delete project')}
            >
                Delete Project
            </Button>
        </Box>
    );
};

export default Project;
