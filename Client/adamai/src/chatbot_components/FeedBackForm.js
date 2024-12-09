import React, {useState} from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useStyles from "../styles.js";
import logo from '../images/adamai_logo.png'

const FeedBackForm = () => {
    const classes = useStyles();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        feedback:"",
    });

    const handleChange = (e) =>{
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            await axios.post("http://localhost:5001/createFeedbackForm", form);
            alert("Feedback was successful");
            setForm({firstName:"", lastName:"", email:"", feedback:""});
        }catch(error){
            alert("Failed submitting");
        }
    };

    return (
        <div className={classes.container}>
            <Paper elevation={2} className = {classes.paper}>
                <img src = {logo} alt="Logo" className={classes.logo}/>
                <Typography variant="h4" className={classes.header}>
                    ADAM's AI Feedback Form
                </Typography>
                <Typography variant = "body1" className={classes.bodyText}>
                    We value your feedback on your experience with the ChatBot
                </Typography>
                <form onSubmit={handleSubmit}>
                <TextField 
                    label = "First Name"
                    variant="outlined"
                    fullWidth
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className={classes.input}
                    sx={{
                        marginBottom: 2,
                        borderRadius: 1,
                    }}
                    />
                    <TextField 
                    label = "Last Name"
                    variant="outlined"
                    fullWidth
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className={classes.input}
                    sx={{
                        marginBottom: 2,
                        borderRadius: 1,
                    }}
                    />
                    <TextField 
                    label = "Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={classes.input}
                    sx={{
                        marginBottom: 2,
                        borderRadius: 1,
                    }}
                    />
                    <TextField 
                    label = "User's FeedBack"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    name="feedback"
                    value={form.feedback}
                    onChange={handleChange}
                    required
                    className={classes.input}
                    sx={{
                        marginBottom: 2,
                        borderRadius: 1,
                    }}
                    />
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button 
                    variant="contained"
                    color="primary"
                    type="submit"
                    endIcon={<SendIcon/>}>
                        Submit Form
                    </Button>
                </Box>
            </form>
            </Paper>
        </div>
    );
};

export default FeedBackForm;
