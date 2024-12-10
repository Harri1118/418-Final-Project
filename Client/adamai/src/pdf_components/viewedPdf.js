import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const PdfViewer = styled('iframe')`
  width: 100%;
  height: 80vh;
  border: none;
`;

const ViewedPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfTitle, setPdfTitle] = useState('Loading...');

  useEffect(() => {
    // Fetch PDF details for title
    axios
      .get(`http://localhost:9000/getPdfDetails/${id}`)
      .then((response) => {
        setPdfTitle(response.data.title || 'Untitled PDF');
        setPdfUrl(`http://localhost:9000/getPdf/${id}`);
      })
      .catch(() => setPdfTitle('PDF not found'));
  }, [id]);

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#e3f2fd', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '20px' }}>
        {pdfTitle}
      </Typography>

      <Box sx={{ marginBottom: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/viewPdfs')}
          sx={{ marginRight: '10px' }}
        >
          Back to PDFs
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(`/editPdf/${id}`)}
        >
          Edit PDF
        </Button>
      </Box>

      {pdfUrl ? (
        <PdfViewer src={pdfUrl} title="PDF Viewer" />
      ) : (
        <Typography variant="h6" style={{ color: '#d32f2f' }}>
          PDF not found
        </Typography>
      )}
    </Box>
  );
};

export default ViewedPdf;
