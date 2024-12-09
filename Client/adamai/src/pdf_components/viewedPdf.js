import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const PdfViewer = styled('iframe')`
  width: 100%;
  height: 200vh;
  border: none;
`;

const ViewedPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    setPdfUrl(`http://localhost:9000/getPdf/${id}`);
  }, [id]);

  return (
    <Box sx={{ padding: '20px', textAlign: 'center', backgroundColor: '#e3f2fd', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '20px' }}>
        PDF Viewer
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ marginBottom: '20px' }}
      >
        Back to PDFs
      </Button>
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
