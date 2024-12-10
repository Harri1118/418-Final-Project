import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button } from '@mui/material';

const EditPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState({ title: '', description: '', file: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:9000/getPdfDetails/${id}`)
      .then((response) => setPdf(response.data))
      .catch(() => setError('Error fetching PDF details.'));
  }, [id]);

  // Handle input changes for title & description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPdf((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setPdf((prev) => ({ ...prev, file: selectedFile }));
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // Save updates
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', pdf.title);
      formData.append('description', pdf.description);
      if (pdf.file) {
        formData.append('file', pdf.file);
      }

      await axios.post(`http://localhost:9000/editPdf/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/viewedPdf/${id}`);
    } catch (err) {
      setError('Error updating PDF.');
    }
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#e3f2fd', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '20px' }}>
        Edit PDF Details
      </Typography>

      {error && (
        <Typography variant="h6" style={{ color: '#d32f2f', marginBottom: '20px' }}>
          {error}
        </Typography>
      )}

      <Box component="form" sx={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        <TextField
          label="Title"
          fullWidth
          name="title"
          value={pdf.title}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px' }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          name="description"
          value={pdf.description}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px' }}
        />

        <label htmlFor="file">Upload New PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ marginBottom: '20px', display: 'block' }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ marginRight: '10px' }}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/viewedPdf/${id}`)}
          >
            Back to PDF
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditPdf;



