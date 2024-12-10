import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Alert,
    Paper,
} from '@mui/material';
import axios from 'axios';

const UploadPdf = () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            setFile(null);
            alert('Please upload a PDF file.');
        }
    };

    const handleCreateFile = async (event) => {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        if (!file || !name || !description) {
            alert('Please fill in all fields and upload a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('user', loggedInUser);
        formData.append('file', file);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('isPublic', isPublic);

        try {
            const response = await axios.post('http://localhost:9000/createPDF', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFile(null);
            setName('');
            setDescription('');
            setIsPublic(false);
            setSuccess('Success! PDF has been created!');
        } catch (err) {
            setError(`Error posting data: ${err.response ? err.response.data : err.message}`);
        }
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2' }}>
                    Upload PDF File
                </Typography>
                <form onSubmit={handleCreateFile}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2, backgroundColor: '#1976d2', color: 'white' }}
                    >
                        Upload PDF
                        <input
                            type="file"
                            hidden
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />
                    </Button>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                sx = {{ marginLeft: 5}}
                                color="primary"
                            />
                        }
                        label="Make Public"
                        sx= {{ paddingTop: 3}}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, backgroundColor: '#1976d2', color: 'white' }}
                    >
                        Create PDF
                    </Button>
                </form>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </Paper>
        </Box>
    );
};

export default UploadPdf;
