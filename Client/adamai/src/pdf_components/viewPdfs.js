import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const PdfContainer = styled(Box)`
  padding: 20px;
  background-color: #e3f2fd; /* Light blue background */
  min-height: 100vh;
`;

const PdfCard = styled(Card)`
  background-color: #1976d2; /* Blue card background */
  color: white;
  border-radius: 8px;
  &:hover {
    background-color: #1565c0;
  }
`;

const ViewButton = styled(Button)`
  background-color: #ffffff;
  color: #1976d2;
  font-weight: bold;
  margin-top: 10px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ViewPdfs = () => {
  const [pdfs, setPdfs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:9000/getPublicPdfs')
      .then((response) => {
        setPdfs(response.data); // Assuming the API returns an array of PDFs
      })
      .catch((error) => {
        console.error('Error fetching PDFs:', error);
      });
  }, []);

  const handleViewPdf = (pdfId) => {
    navigate(`/viewedPdf/${pdfId}`);
  };

  return (
    <PdfContainer>
      <Typography variant="h3" style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '20px' }}>
        Public PDFs
      </Typography>

      {pdfs.length > 0 ? (
        <Box sx={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {pdfs.map((pdf, index) => (
            <PdfCard key={index} sx={{ width: '300px', marginBottom: '1rem' }}>
              <CardContent>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                  {pdf.title}
                </Typography>
                <Typography variant="body1" style={{ marginTop: '10px' }}>
                  {pdf.description}
                </Typography>
                <ViewButton fullWidth onClick={() => handleViewPdf(pdf._id)}>
                  View PDF
                </ViewButton>
              </CardContent>
            </PdfCard>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" style={{ color: '#d32f2f', textAlign: 'center' }}>
          No public PDFs available at the moment.
        </Typography>
      )}
    </PdfContainer>
  );
};

export default ViewPdfs;