import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Box, Typography, Card, CardContent, Button, Grid2 } from '@mui/material';
import { styled } from '@mui/material/styles';

const SubscriptionContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #e3f2fd; /* Light blue background */
  min-height: 100vh;
`;

const SubscriptionCard = styled(Card)`
  width: 100%;
  max-width: 300px;
  background-color: #1976d2; /* Blue background for the card */
  color: white;
  border-radius: 8px;
  &:hover {
    background-color: #1565c0;
  }
`;

const SubscribeButton = styled(Button)`
  margin-top: 20px;
  background-color: #ffffff;
  color: #1976d2;
  font-weight: bold;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Subscribe = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const hasPurchased = localStorage.getItem('hasPurchased');

  const subscriptionPlans = [
    {
      title: 'Basic',
      price: '$5/month',
      features: ['Access to basic features', 'Limited support', 'Single device access'],
    },
    {
      title: 'Standard',
      price: '$10/month',
      features: ['Access to all features', 'Priority support', 'Multiple device access'],
    },
    {
      title: 'Premium',
      price: '$20/month',
      features: ['All features + AI tools', '24/7 support', 'Unlimited device access', 'Exclusive content'],
    },
  ];

//   const handleSubscribe = (event, loggedInUser) => {
//     event.preventDefault();
//     console.log(`User ${loggedInUser} selected a subscription plan.`);
//   };

  return (
    <SubscriptionContainer>
      <Typography variant="h3" style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '40px' }}>
        Choose Your Subscription Plan
      </Typography>

      {loggedInUser ? (
        <Grid2 container spacing={4} justifyContent="center">
          {subscriptionPlans.map((plan, index) => (
            <Grid2 item key={index}>
              <SubscriptionCard>
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="h4" style={{ textAlign: 'center', margin: '10px 0' }}>
                    {plan.price}
                  </Typography>
                  <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                    {plan.features.map((feature, i) => (
                      <li key={i} style={{ marginBottom: '8px' }}>{feature}</li>
                    ))}
                  </ul>
                  <SubscribeButton
                    variant="contained"
                    fullWidth
                    // onClick={(event) => handleSubscribe(event, loggedInUser)}
                  >
                    Subscribe
                  </SubscribeButton>
                </CardContent>
              </SubscriptionCard>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="h5" style={{ color: '#d32f2f', textAlign: 'center' }}>
          Please log in to view subscription plans.
        </Typography>
      )}

      {hasPurchased && (
        <Typography variant="body1" style={{ marginTop: '20px', color: '#4caf50' }}>
          You already have an active subscription.
        </Typography>
      )}
    </SubscriptionContainer>
  );
};

export default Subscribe;
