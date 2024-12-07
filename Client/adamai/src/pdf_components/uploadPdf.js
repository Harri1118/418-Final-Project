import React, { useState } from 'react';
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
        formData.append('user',loggedInUser)
        formData.append('file', file);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('isPublic', isPublic);

        try {
            const response = await axios.post('http://localhost:9000/createPDF', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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
        <div>
            <label>Upload a PDF file</label>
            <form onSubmit={handleCreateFile}>
                <label htmlFor="name">Title</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="file">Select Knowledge base to load from</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    id="file"
                />
                <label htmlFor="isPublic">Public</label>
                <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                />
                <button type="submit">Create PDF</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default UploadPdf;