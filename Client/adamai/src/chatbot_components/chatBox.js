import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const ChatContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #e3f2fd;
  padding: 20px;
  box-sizing: border-box;
`;

const ChatHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChatDisplay = styled(Paper)`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatBubble = styled(Box)`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: ${(props) => (props.sender === 'User' ? '#1976d2' : '#e0e0e0')};
  color: ${(props) => (props.sender === 'User' ? 'white' : 'black')};
  align-self: ${(props) => (props.sender === 'User' ? 'flex-end' : 'flex-start')};
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
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

const HomeButton = styled(Button)`
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #1565c0;
  }
`;

const Chatbox = () => {
  const [chatLog, setChatLog] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { projId } = useParams();
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('loggedInUser');

  useEffect(() => {
    if (loggedInUser && projId) {
      axios
        .post('http://localhost:9000/configureChatbot', { projId })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error('Error configuring chatbot:', error);
        });
    }
  }, [loggedInUser, projId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (userInput.trim() === '') return;

    const userMessage = { sender: 'User', text: userInput };
    setChatLog((prevLog) => [...prevLog, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const simulatedDelay = 1500; 
      setTimeout(async () => {
        const response = await axios.post('http://localhost:9000/sendMessage', { input: userInput });
        const botResponse = { sender: 'Bot', text: response.data.response };
        setChatLog((prevLog) => [...prevLog, botResponse]);
        setLoading(false);
      }, simulatedDelay);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = { sender: 'Bot', text: "Sorry, there was an error processing your request." };
      setChatLog((prevLog) => [...prevLog, errorResponse]);
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      sendMessage(event);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2' }}>
          Chatbox
        </Typography>
        <HomeButton onClick={() => navigate('/')} variant="contained">
          Home
        </HomeButton>
      </ChatHeader>

      <ChatDisplay>
        {chatLog.map((msg, index) => (
          <ChatBubble key={index} sender={msg.sender}>
            {msg.sender === 'Bot' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </ChatBubble>
        ))}
        {loading && (
          <ChatBubble sender="Bot">
            <CircularProgress size={20} style={{ marginRight: 10 }} />
            Adam AI is typing...
          </ChatBubble>
        )}
      </ChatDisplay>

      <InputContainer>
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SendButton onClick={sendMessage} variant="contained">
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chatbox;
