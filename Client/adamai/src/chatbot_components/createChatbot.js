import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const CreateChatbot = () => {
    // logged in user
    const loggedInUser = localStorage.getItem('loggedInUser');
    // Predefined options for dropdowns
    const personalityOptions = ['Friendly', 'Professional', 'Humorous', 'Empathetic', 'Authoritative'];
    const knowledgeLevelOptions = ['Basic', 'Intermediate', 'Advanced', 'Expert'];
    const languageStyleOptions = ['Formal', 'Casual', 'Technical', 'Conversational', 'Creative'];

    // Variables to be inputted
    const [botName, setBotName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [audience, setAudience] = useState('');
    const [selectedPersonalities, setSelectedPersonalities] = useState([]);
    const [knowledge, setKnowledge] = useState('');
    const [selectedLanguageStyles, setSelectedLanguageStyles] = useState([]);
    const [keyFunctionalities, setKeyFunctionalities] = useState('');
    const [customResponse, setCustomResponse] = useState('');
    const [fallbackBehavior, setFallBackBehavior] = useState('');
    const [privacyNeeds, setPrivacyNeeds] = useState('');
    const [error, setError] = useState(null); // To handle error messages
    const [success, setSuccess] = useState(null);

    const handleCreateChatBot = async (event) => {
        event.preventDefault();

        setError(null);
        setSuccess(null);
        console.log(selectedLanguageStyles)
        try {
            const response = await axios.post('http://localhost:9000/CreateChatbot', {
                owner: loggedInUser,
                name: botName,
                purpose: purpose,
                audience: audience,
                knowledgeLevel: knowledge,
                languageStyles: selectedLanguageStyles,
                personalityTraits: selectedPersonalities,
                keyFunctions: keyFunctionalities,
                fallBackBehavior: fallbackBehavior,
                privacyNeeds: privacyNeeds
            });
            setBotName('')
            setPurpose('')
            setKnowledge('')
            setSelectedLanguageStyles([])
            setSelectedPersonalities([])
            setKeyFunctionalities('')
            setFallBackBehavior('')
            setPrivacyNeeds('')
            setAudience('')
            setCustomResponse('')
            setSuccess("Success! " + botName + " has been created!")
        } catch (err) {
            setError(`Error posting data: ${err.response ? err.response.data : err.message}`);
        }    
    };
    
    return (
        <Box sx={{ maxWidth: '600px', margin: 'auto', mt: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create a Chatbot
            </Typography>
            {success && <Typography variant="h6" color="green">{success}</Typography>}
            {error && <Typography variant="h6" color="red">{error}</Typography>}
            <form onSubmit={handleCreateChatBot}>
                <TextField
                    label="Chatbot Name"
                    fullWidth
                    margin="normal"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    required
                />
                <TextField
                    label="Purpose"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                />
                <TextField
                    label="Target Audience"
                    fullWidth
                    margin="normal"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    required
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Chatbot Personality</InputLabel>
                    <Select
                        multiple
                        value={selectedPersonalities}
                        onChange={(e) => setSelectedPersonalities(e.target.value)}
                        renderValue={(selected) => selected.join(', ')}
                        required
                    >
                        {personalityOptions.map((personality, index) => (
                            <MenuItem key={index} value={personality}>
                                {personality}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Preferred Knowledge Level</InputLabel>
                    <Select
                        value={knowledge}
                        onChange={(e) => setKnowledge(e.target.value)}
                        required
                    >
                        {knowledgeLevelOptions.map((level, index) => (
                            <MenuItem key={index} value={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Language Styles</InputLabel>
                    <Select
                        multiple
                        value={selectedLanguageStyles}
                        onChange={(e) => setSelectedLanguageStyles(e.target.value)}
                        renderValue={(selected) => selected.join(', ')}
                        required
                    >
                        {languageStyleOptions.map((languageStyle, index) => (
                            <MenuItem key={index} value={languageStyle}>
                                {languageStyle}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Key Functionalities"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={keyFunctionalities}
                    onChange={(e) => setKeyFunctionalities(e.target.value)}
                    required
                />
                <TextField
                    label="Custom Responses"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={customResponse}
                    onChange={(e) => setCustomResponse(e.target.value)}
                    required
                />
                <TextField
                    label="Fallback Behavior"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={fallbackBehavior}
                    onChange={(e) => setFallBackBehavior(e.target.value)}
                    required
                />
                <TextField
                    label="Privacy & Security Needs"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={privacyNeeds}
                    onChange={(e) => setPrivacyNeeds(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Create Chatbot
                </Button>
            </form>
        </Box>
    );
};

export default CreateChatbot;
