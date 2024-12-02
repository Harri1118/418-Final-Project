import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #e3f2fd;
  padding: 20px;
  box-sizing: border-box;
`;

const ChatDisplay = styled(Paper)`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const InputContainer = styled(Box)`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SendButton = styled(Button)`
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #1565c0;
  }
`;

const Chatbox = () => {
  const [chatLog, setChatLog] = useState([]);
  const [userInput, setUserInput] = useState('');
  const { projId } = useParams();
  const loggedInUser = localStorage.getItem('loggedInUser');
  const hasPurchased = localStorage.getItem('hasPurchased');

  const botResponses = [
    "Hello! How can I assist you today?",
    "I'm here to help with any questions you have.",
    "Let me know if you need further clarification.",
    "Thank you for reaching out!",
    "Is there anything else you'd like to know?",
  ];

  const sendMessage = (event) => {
    event.preventDefault();
    if (userInput.trim() === '') return;

    // Add user message to the chat log
    const userMessage = { sender: 'User', text: userInput };
    setChatLog((prevLog) => [...prevLog, userMessage]);

    // Clear input
    setUserInput('');

    // Simulate bot response
    const botResponse = {
      sender: 'Bot',
      text: botResponses[chatLog.length % botResponses.length],
    };
    setTimeout(() => {
      setChatLog((prevLog) => [...prevLog, botResponse]);
    }, 500); // Simulate response delay
  };

  return (
    <ChatContainer>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '20px' }}>
        Chatbox
      </Typography>

      <ChatDisplay>
        <List>
          {chatLog.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={msg.sender === 'User' ? 'You' : 'Adam AI'}
                secondary={msg.text}
                primaryTypographyProps={{
                  fontWeight: 'bold',
                  color: msg.sender === 'User' ? 'primary' : 'secondary',
                }}
              />
            </ListItem>
          ))}
        </List>
      </ChatDisplay>

      <InputContainer>
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <SendButton onClick={sendMessage} variant="contained">
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chatbox;
