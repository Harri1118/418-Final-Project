import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl, Stack, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Meter from '../widget_components/Meter';
import axios from 'axios';

const EditChatbot = () => {
    // logged in user
    const loggedInUser = localStorage.getItem('loggedInUser');
    const { projId } = useParams();
    const [chatbot, setChatBot] = useState([]);
    // Predefined options for dropdowns
    const personalityOptions = ['Friendly', 'Professional', 'Humorous', 'Empathetic', 'Authoritative'];
    const knowledgeLevelOptions = ['Basic', 'Intermediate', 'Advanced', 'Expert'];
    const languageStyleOptions = ['Formal', 'Casual', 'Technical', 'Conversational', 'Creative'];
    const defaultSpeechPatternOptions = ['Greeting', 'Acknowledgement', 'Closure','Fallback'];
    const [speechPatternOptions, setSpeechPatternOptions] = useState(defaultSpeechPatternOptions)
    const quotesTemplate = {
        Greeting: ["Hello! How can I assist you today?", "Hi there! What can I do for you?", "Welcome! How can I help?"],
        Acknowledgement: ["Got it! Let me check that for you.", "Sure thing! I'll get right on it.", "Understood. Give me a moment."],
        Closure: ["Is there anything else I can help with?", "Thanks for chatting! Have a great day!", "Goodbye! Feel free to reach out anytime."],
        Fallback: ["Oops! Something went wrong. Let's try again.", "I'm sorry, I didn't catch that. Could you please repeat?", "Hmm, I don't have that information. Can I help with something else?"]
    };
    const [PDFileOptions, setPDFileOptions] = useState([]) 
    // Variables to be inputted
    const [botName, setBotName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [audience, setAudience] = useState('');
    const [selectedPersonalities, setSelectedPersonalities] = useState([]);
    const [knowledge, setKnowledge] = useState('');
    const [selectedLanguageStyles, setSelectedLanguageStyles] = useState([]);
    const [keyFunctionalities, setKeyFunctionalities] = useState('');
    // In place for customResponse field.
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const [quotes, setQuotes] = useState(quotesTemplate);
    const [editQuote, setEditQuote] = useState({ pattern: '', index: -1, text: '' });
    const [newPattern, setNewPattern] = useState('');
    const [newQuote, setNewQuote] = useState('');
    // Rest of the fields.
    const [fallbackBehavior, setFallBackBehavior] = useState('');
    const [privacyNeeds, setPrivacyNeeds] = useState('');
    const [temperature, setTemperature] = useState('');
    const [wordLimit, setWordLimit] = useState('');
    const [file, setFile] = useState([])
    const [error, setError] = useState(null); // To handle error messages
    const [success, setSuccess] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (loggedInUser) {
                try {
                    const fileOptionsResponse = await axios.get('http://localhost:9000/getFileOptionsByUser', { params: { loggedInUser } });
                    setPDFileOptions(fileOptionsResponse.data); // Assuming the API returns an array of projects
    
                    const chatBotResponse = await axios.get('http://localhost:9000/getChatBotById', { params: { projId } });
                    setChatBot(chatBotResponse.data)
                    setBotName(chatBotResponse.data.name);
                    setPurpose(chatBotResponse.data.purpose);
                    setAudience(chatBotResponse.data.audience);
                    setKeyFunctionalities(chatBotResponse.data.keyFunctions)
                    setFallBackBehavior(chatBotResponse.data.fallBackBehavior)
                    setPrivacyNeeds(chatBotResponse.data.privacyNeeds)
                    setSelectedPersonalities(chatBotResponse.data.personalityTraits)
                    setKnowledge(chatBotResponse.data.knowledgeLevel)
                    setSelectedLanguageStyles(chatBotResponse.data.languageStyles)
                    setTemperature(chatBotResponse.data.temperature)
                    setWordLimit(chatBotResponse.data.wordLimit)
                    const combinedData = JSON.parse(chatBotResponse.data.speechPatterns)
                    setSelectedPatterns(Object.keys(combinedData.quotes))
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
    
        fetchData();
    }, [loggedInUser]);

    const handleEditChatBot = async (event) => {
        event.preventDefault();

        const combinedData = JSON.stringify({
            quotes
        });
        console.log(combinedData)
        //console.log(typeof(quotes))
        try {
            const response = await axios.post('http://localhost:9000/editChatbot', {
                projId: projId,
                owner: loggedInUser,
                name: botName,
                purpose: purpose,
                audience: audience,
                knowledgeLevel: knowledge,
                languageStyles: selectedLanguageStyles,
                personalityTraits: selectedPersonalities,
                keyFunctions: keyFunctionalities,
                speechPatterns : combinedData,
                fallBackBehavior: fallbackBehavior,
                privacyNeeds: privacyNeeds,
                temperature: temperature,
                wordLimit: wordLimit,
                vectorDb : file._id
            });
            setSuccess("Success! " + botName + " has been edited!")
        } catch (err) {
            setError(`Error posting data: ${err.response ? err.response.data : err.message}`);
        }    
    };
    
    const handleChange = (event) => {
        setSelectedPatterns(event.target.value);
    };

    const handleEditQuote = (pattern, index, text) => {
        setEditQuote({ pattern, index, text });
    };

    const handleSaveQuote = () => {
        setQuotes(prevQuotes => ({
            ...prevQuotes,
            [editQuote.pattern]: prevQuotes[editQuote.pattern].map((quote, i) => i === editQuote.index ? editQuote.text : quote)
        }));
        setEditQuote({ pattern: '', index: -1, text: '' });
    };

    const handleAddQuote = (pattern) => {
        setQuotes(prevQuotes => ({
            ...prevQuotes,
            [pattern]: [...prevQuotes[pattern], newQuote]
        }));
        setNewQuote('');
    };

    const handleRemoveQuote = (pattern, index) => {
        setQuotes(prevQuotes => ({
            ...prevQuotes,
            [pattern]: prevQuotes[pattern].filter((_, i) => i !== index)
        }));
    };
    
    const handleAddPattern = () => {
        if (newPattern && !speechPatternOptions.includes(newPattern)) {
            setSpeechPatternOptions([...speechPatternOptions, newPattern]);
            setQuotes({ ...quotes, [newPattern]: [] });
            setNewPattern('');
        }
    };
    
    const handleTemperatureChange = (event, newValue) => {
        setTemperature(newValue);
      };
      // handleWordLimitChange
    const handleWordLimitChange = (event, newValue) => {
        setWordLimit(newValue);
      };
    return (
        <Box sx={{ maxWidth: '600px', margin: 'auto', mt: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit your chatbot
            </Typography>
            {success && <Typography variant="h6" color="green">{success}</Typography>}
            {error && <Typography variant="h6" color="red">{error}</Typography>}
            <form onSubmit={handleEditChatBot}>
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
            <Stack spacing={2}>
            <Box>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Speech Patterns</InputLabel>
                    <Select
                        multiple
                        value={selectedPatterns}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(', ')}
                        required
                    >
                        {speechPatternOptions.map((pattern, index) => (
                            <MenuItem key={index} value={pattern}>
                                {pattern}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <TextField
                    fullWidth
                    label="Add New Speech Pattern"
                    value={newPattern}
                    onChange={(e) => setNewPattern(e.target.value)}
                    margin="normal"
                />
                <Button onClick={handleAddPattern} variant="contained" color="primary">
                    Add Pattern
                </Button>
            </Box>
            <Box>
                {selectedPatterns.map((pattern) => (
                    <Box key={pattern} mb={2}>
                        <Typography variant="h6">{pattern}</Typography>
                        {quotes[pattern].map((quote, i) => (
                            <Box key={i} mb={1} display="flex" alignItems="center">
                                {editQuote.pattern === pattern && editQuote.index === i ? (
                                    <Box flexGrow={1}>
                                        <TextField
                                            fullWidth
                                            value={editQuote.text}
                                            onChange={(e) => setEditQuote({ ...editQuote, text: e.target.value })}
                                            margin="normal"
                                        />
                                        <Button onClick={handleSaveQuote} variant="contained" color="primary">
                                            Save
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box display="flex" alignItems="center" flexGrow={1}>
                                        <Typography variant="body1" flexGrow={1}>{quote}</Typography>
                                        <Button onClick={() => handleEditQuote(pattern, i, quote)} variant="outlined" color="secondary">
                                            Edit
                                        </Button>
                                        <IconButton onClick={() => handleRemoveQuote(pattern, i)} color="error">
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        ))}
                        <Box display="flex" alignItems="center">
                            <TextField
                                fullWidth
                                label="Add New Quote"
                                value={newQuote}
                                onChange={(e) => setNewQuote(e.target.value)}
                                margin="normal"
                            />
                            <Button onClick={() => handleAddQuote(pattern)} variant="contained" color="primary">
                                Add Quote
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Stack>         
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
                <Meter value={temperature} onChange={handleTemperatureChange} title="Temperature" min={0} max={1} allowDecimals={true} />
                <Meter value={wordLimit} onChange={handleWordLimitChange} title="Word Limit" min={1} max={2000} allowDecimals={false} />
                <FormControl fullWidth margin="normal">
                <InputLabel>Select PDF</InputLabel>
                <Select
                    value={file}
                    onChange={(e) => setFile(e.target.value)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {PDFileOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Edit Chatbot
                </Button>
            </form>
        </Box>
    );
};

export default EditChatbot;