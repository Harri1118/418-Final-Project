const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');

const { handleUserInput, updateConfigWithMongoData } = require('./chatbot');

const User = require('./schemas/baseSchemas/User');
const Chatbot = require('./schemas/baseSchemas/ChatBot');
const Subscription = require('./schemas/simpleSchemas/Subscription')
const Pdf = require('./schemas/baseSchemas/PDF_File')
const PublicFile = require('./schemas/simpleSchemas/publicFile')
const FavoritedFiles = require('./schemas/simpleSchemas/FavoritedFiles')
const ChatLog = require('./schemas/baseSchemas/ChatLog')

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const mongoString = process.env.MONGO_URI;
mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
});

const database = mongoose.connection;
database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database Connected'));

app.listen(9000, () => {
    console.log(`Server Started at ${9000}`);
});

app.post('/createUser', async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        });
        await user.save();
        return res.status(201).send("User created successfully");
    } catch (error) {
        if (error.code === 11000) {
            console.log("Duplicate username");
            return res.status(400).send("Username already exists");
        }
        console.error("Error creating user:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.get('/getUser', async (req, res) => {
    console.log(`SERVER: GET USER REQ BODY: ${req.query}`);
    const username = req.query.username;
    const password = req.query.password;
    console.log(username);
    try {
        const user = await User.findOne({ username });
        if (password !== user.password) {
            return res.status(401).send("Incorrect password");
          }
        return res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/getUserById', async (req, res) => {
    const { user_id } = req.query;
    try {
        const user = await User.findOne({ _id: user_id });
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/getUsers', async (req, res) => {
    try {
        const userList = await User.find({}, {firstName:1, lastName:1});
        res.send(userList)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// chat bot methods

app.post('/CreateChatbot', async (req, res) => {
    try {
        const owner = await User.findOne({username: req.body.owner});
        const vectorDb = await Pdf.findOne({_id : req.body.vectorDb})
        const chatbot = new Chatbot({
            owner: owner,
            name: req.body.name,
            purpose: req.body.purpose,
            audience: req.body.audience,
            knowledgeLevel: req.body.knowledgeLevel,
            languageStyles: req.body.languageStyles,
            personalityTraits: req.body.personalityTraits,
            keyFunctions: req.body.keyFunctions,
            speechPatterns: req.body.speechPatterns,
            fallBackBehavior: req.body.fallBackBehavior,
            privacyNeeds: req.body.privacyNeeds,
            temperature: req.body.temperature,
            wordLimit: req.body.wordLimit,
            vectorDb : vectorDb
        });
        console.log(chatbot)
        await chatbot.save();
        res.status(200).send("Success! Added chatbot!");
    } catch (error) {
        res.status(500).json({ error: 'Error generating response' });
    }
});

app.post('/getProjects', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.loggedInUser });
      const projects = await Chatbot.find({ owner: user });
      return res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving projects' });
    }
  });

app.get('/getProject', async (req, res) => {
    try{
        const project = await Chatbot.find({botName : req.body.botName})
        return res.status(200).json(project)
    } catch(error){
        res.status(500).json({ error: 'Error Retrieving projects' });
    }
})

app.post('/configureChatBot', async (req,res) => {
    try{
        const chatbot = await Chatbot.find({_id : req.body.projId});
        //console.log(chatbot)
        updateConfigWithMongoData(chatbot);
        return res.status(200).send("Sucessfully loaded the chatbot.");
    } catch(error){
        return res.status(500).send("Unable to configure chatbot.");
    }
});

// Create an endpoint to handle user input
app.post('/sendMessage', async (req, res) => {
    const userInput = req.body.input;
    try {
        const response = await handleUserInput(userInput);
        res.json({ response: response });
    } catch (error) {
        res.status(500).json({ error: 'Error generating response' });
    }
});

// Input methods?

app.get('/getSubscriptions', async (req, res) => {
    try {
        const SubscriptionList = await Subscription.find();
        res.send(SubscriptionList)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.post('/createPDF', upload.single('file'), async (req, res) => {
    try {
        const { user, name, description, isPublic } = req.body;
        const Owner = await User.findOne({username: req.body.user})
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Check if the PDF already exists in the public schema
        const existingPublicFile = await PublicFile.findOne({ 'PDF_File.title': name });
        if (existingPublicFile) {
            return res.status(400).json({ error: 'PDF already exists in the public schema' });
        }

        // Read the uploaded PDF file
        const filePath = path.join(__dirname, file.path);
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Add metadata to the PDF
        pdfDoc.setTitle(name);
        pdfDoc.setSubject(description);

        // Save the modified PDF
        const modifiedPdfBytes = await pdfDoc.save();
        const modifiedFilePath = path.join(__dirname, 'uploads', `${name}.pdf`);
        fs.writeFileSync(modifiedFilePath, modifiedPdfBytes);

        // Convert Uint8Array to Buffer
        const pdfBuffer = Buffer.from(modifiedPdfBytes);

        // Create the PDF file schema entry
        const newPdf = new Pdf({
            owner: Owner,
            title: name,
            description: description,
            pdfFile: {
                data: pdfBuffer,
                contentType: 'application/pdf'
            }
        });
        await newPdf.save();

        // If public, add to the public file schema
        if (isPublic) {
            const newPublicFile = new PublicFile({
                owner: Owner._id, // Assuming you have user authentication
                PDF_File: newPdf._id
            });
            await newPublicFile.save();
        }

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.status(200).send('Success! PDF has been created!');
    } catch (error) {
        console.error('Error creating PDF:', error);
        res.status(500).json({ error: 'Error creating PDF' });
    }
});

app.get('/getFileOptionsByUser', async (req, res) => {
    try {
      // Find the user account
      const userAccount = await User.findOne({ username: req.query.loggedInUser });
      console.log(userAccount);
      if (!userAccount) {
        return res.status(404).send('User not found');
      }
  
      // Find all PDF files associated with the user
      const userPDFs = await Pdf.find({ owner: userAccount._id });
  
      // Find all favorited files associated with the user's ID
      const favoritedFiles = await FavoritedFiles.find({ user: userAccount._id }).populate('file');
  
      // Extract the actual PDF files from the favorited files
      const favoritedPDFs = favoritedFiles.map(fav => fav.file.PDF_File);
  
      // Combine both arrays
      const finFiles = [...userPDFs, ...favoritedPDFs];
  
      // Send the combined list of files as the response
      res.status(200).json(finFiles);
    } catch (error) {
      res.status(500).send(error);
    }
  });


  // Chat log methods
  app.post('/saveChatLog', async (req, res) => {
    try{
        const {userName, chatBotId, log} = req.body;
        const usr = await User.findOne({username : userName})
        if(!usr){
            res.status(500).send("User not found!")
        }
        const chatbot = await Chatbot.findOne({_id : chatBotId})
        if(!chatbot){
            res.status(500).send("Chatbot not found!")
        }
        const chatLog = new ChatLog({user : usr, chatBot: chatbot, messages: log})
        console.log(chatLog)
        await chatLog.save()
        return res.status(200).send("Success! Chat log created!")
    } catch(error){
        res.status(500).send(error)
    }
  });

  app.get('/getChatLogsBySession', async (req, res) => {
    try{
        const{userName, chatBotId} = req.body
        const usr = await User.findOne({username : userName})
        if(!usr){
            res.status(500).send("User not found!")
        }
        const chatbot = await Chatbot.findOne({_id : chatBotId})
        if(!chatbot){
            res.status(500).send("Chatbot not found!")
        }
        const logs = ChatLog.find({user: usr, chatBot: chatbot})
        return res.status(200).json(logs)
    } catch(error){
        res.status(500).send(error)
    }
  })

  //endpoints for pdf viewing
  app.get('/getPublicPdfs', async (req, res) => {
    try {
        const publicFiles = await PublicFile.find().populate('PDF_File');
        const pdfs = publicFiles.map((file) => ({
            _id: file.PDF_File._id,
            title: file.PDF_File.title,
            description: file.PDF_File.description,
        }));
        res.status(200).json(pdfs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching public PDFs' });
    }
});

app.get('/getPdf/:id', async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) {
            return res.status(404).send('PDF not found');
        }
        res.contentType('application/pdf');
        res.send(pdf.pdfFile.data);
    } catch (error) {
        res.status(500).send(error);
    }
});