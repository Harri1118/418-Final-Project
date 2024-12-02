import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid2, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const DashboardContainer = styled(Box)`
  padding: 20px;
  background-color: #e3f2fd; /* Light blue background */
  min-height: 100vh;
`;

const ProjectCard = styled(Card)`
  background-color: #1976d2; /* Blue card background */
  color: white;
  border-radius: 8px;
  &:hover {
    background-color: #1565c0;
  }
`;

const ProjectButton = styled(Button)`
  background-color: #ffffff;
  color: #1976d2;
  font-weight: bold;
  margin-top: 10px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const loggedInUser = localStorage.getItem('loggedInUser');
  const hasPurchased = localStorage.getItem('hasPurchased');
  const navigate = useNavigate();

  // Fetch projects associated with the logged-in user
//   useEffect(() => {
//     if (loggedInUser) {
//       axios
//         .get(`http://localhost:9000/projects?user=${loggedInUser}`)
//         .then((response) => {
//           setProjects(response.data); // Assuming the API returns an array of projects
//         })
//         .catch((error) => {
//           console.error('Error fetching projects:', error);
//         });
//     }
//   }, [loggedInUser]);

  return (
    <DashboardContainer>
      <Typography variant="h3" style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '20px' }}>
        My Projects
      </Typography>
      {projects.length > 0 ? (
        <Grid2 container spacing={3}>
          {projects.map((project, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <ProjectCard>
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {project.name}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                    {project.description}
                  </Typography>
                  <ProjectButton
                    fullWidth
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    View Project
                  </ProjectButton>
                </CardContent>
              </ProjectCard>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="h6" style={{ color: '#d32f2f', textAlign: 'center' }}>
          No projects found. Start creating your first project!
        </Typography>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
