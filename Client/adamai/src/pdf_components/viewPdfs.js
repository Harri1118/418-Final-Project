import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

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

  useEffect(() => {
    axios
      .get('http://localhost:9000/getPublicPdfs')
      .then((response) => {
        setPdfs(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching PDFs:', error);
      });
  }, []);

  return (
    <PdfContainer>
      <Typography variant="h3" style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '20px' }}>
        Public PDFs
      </Typography>
      {pdfs.length > 0 ? (
        <Grid container spacing={3}>
          {pdfs.map((pdf, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <PdfCard>
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {pdf.title}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                    {pdf.description}
                  </Typography>
                  <ViewButton
                    fullWidth
                    onClick={() => window.open(`http://localhost:9000/getPdf/${pdf._id}`, '_blank')}
                  >
                    View PDF
                  </ViewButton>
                </CardContent>
              </PdfCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" style={{ color: '#d32f2f', textAlign: 'center' }}>
          No public PDFs available at the moment.
        </Typography>
      )}
    </PdfContainer>
  );
};

export default ViewPdfs;