import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const CreateChatbot = () => {
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
    const [selectedLanguageStyles, setSelectedLanguageStyles] = useState('');
    const [keyFunctionalities, setKeyFunctionalities] = useState('');
    const [customResponse, setCustomResponse] = useState('');
    const [fallbackBehavior, setFallBackBehavior] = useState('');
    const [privacyNeeds, setPrivacyNeeds] = useState('');

    const handleCreateChatBot = async (event) => {
        event.preventDefault();
        console.log({
            botName,
            purpose,
            audience,
            selectedPersonalities,
            knowledge,
            selectedLanguageStyles,
            keyFunctionalities,
            customResponse,
            fallbackBehavior,
            privacyNeeds,
        });
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: 'auto', mt: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Create a Chatbot
            </Typography>
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
                    <InputLabel>Preferred Language Style</InputLabel>
                    <Select
                        value={selectedLanguageStyles}
                        onChange={(e) => setSelectedLanguageStyles(e.target.value)}
                        required
                    >
                        {languageStyleOptions.map((style, index) => (
                            <MenuItem key={index} value={style}>
                                {style}
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
