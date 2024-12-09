const dotenv = require('dotenv');
dotenv.config(); // Load environment variables first

const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const {MemoryVectorStore} = require('langchain/vectorstores/memory')
const {createRetrievalChain} = require('langchain/chains/retrieval')
const {RecursiveCharacterTextSplitter} = require('langchain/text_splitter')
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const {OpenAIEmbeddings} = require('@langchain/openai')

const {stageFile} = require('./convertPdf')

const PDF_PATH = 'temp/vectorDb.pdf';

let model = new ChatOpenAI({
    modelName: "gpt-4",
    openAIApiKey: process.env.OPENAI_API_KEY,
});

// Define the template with placeholders
const templateNoContext = `
    You are a chatbot with the following configuration:
    Name: {{name}}
    Purpose: {{purpose}}
    Audience: {{audience}}
    Language Styles: {{languageStyle}}
    Personality Traits: {{personalityTraits}}
    Key Functions: {{keyFunctions}}
    Speech Patterns: \n{{speechPatterns}}\n
    Fallback Behavior: {{fallbackBehavior}}
    Knowledge Level: {{knowledgeLevel}}
    Privacy Needs: {{privacyNeeds}}
    
    Now, answer the following question with the following world limit at {{wordLimit}}:
    {input}
`;

// Define the template with placeholders
const templateWithContext = `
    You are a chatbot with the following configuration:
    Name: {{name}}
    Purpose: {{purpose}}
    Audience: {{audience}}
    Language Styles: {{languageStyle}}
    Personality Traits: {{personalityTraits}}
    Key Functions: {{keyFunctions}}
    Speech Patterns: \n{{speechPatterns}}\n
    Fallback Behavior: {{fallbackBehavior}}
    Knowledge Level: {{knowledgeLevel}}
    Privacy Needs: {{privacyNeeds}}

    Now, answer the following question with the following world limit at {{wordLimit}}:
    {input}

    In order to research the information necesarry, please utilize this context:
    {context}
`;

const addChatLogContextTemplate = `
    Alongside this context, you've had this previous conversation with the user:
    {chatLog}
    Please make sure to act within all these parameters.
`;
// Create the LLMChain with the initial prompt
let chain = null;
let retrievalChain = null;
let chatLog = null;

async function updateConfigWithMongoData(configData) {
    try {
        chain = null;
        retrievalChain = null;
        let config = configData[0]
        //console.log(config)
        model.temperature = Number(config.temperature)
        if(config.vectorDb){
            let promptString = mapTemplateToData(templateWithContext, config)
            if(chatLog){
                promptString += chatLog
            }
            chatLog = null
            let prompt = ChatPromptTemplate.fromTemplate(promptString)
            chain = prompt.pipe(model)
            stageFile(config.vectorDb)
            const loader = new PDFLoader(PDF_PATH);
            const docs = await loader.load()
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 200,
                chunkOverlap: 20,
            })
            const splitDocs = await splitter.splitDocuments(docs)
            console.log(splitDocs)
            const embeddings = new OpenAIEmbeddings();
            const vectorStore = await MemoryVectorStore.fromDocuments(
                splitDocs,
                embeddings
            )
            const retriever = vectorStore.asRetriever({
                k : 3
            });
            retrievalChain = await createRetrievalChain({
                combineDocsChain: chain,
                retriever
            });
        }
        else{
            let promptString = mapTemplateToData(templateNoContext, config);
            if(chatLog){
                promptString += chatLog
            }
            chatLog = null
            let prompt = ChatPromptTemplate.fromTemplate(promptString); // Update the prompt template with new data
            console.log(promptString)
            chain = prompt.pipe(model)
        }
    } catch (error) {
        console.error("Error updating config with MongoDB data:", error.message);
    }
}

function updateConfigWithChatHistory(chatLog){
    const logs = JSON.parse(chatLog)
    let promptString = addChatLogContextTemplate
    let chatLogString = logs.map(entry => `${entry.sender}: ${entry.text}`).join('\n');
    chatLog = promptString.replace("{chatLog}", chatLogString || "")
    console.log(chatLog)
}
// Mapping template placeholders to actual data from MongoDB object
function mapTemplateToData(template, data) {
    return template
        .replace("{{name}}", data.name || "")
        .replace("{{purpose}}", data.purpose || "")
        .replace("{{audience}}", data.audience || "")
        .replace("{{languageStyle}}", data.languageStyles || "")
        .replace("{{personalityTraits}}", data.personalityTraits || "")
        .replace("{{keyFunctions}}", data.keyFunctions || "")
        .replace("{{speechPatterns}}", convertSpeechPatterns(data.speechPatterns || "{}"))
        .replace("{{fallbackBehavior}}", data.fallBackBehavior || "")
        .replace("{{knowledgeLevel}}", data.knowledgeLevel || "")
        .replace("{{privacyNeeds}}", data.privacyNeeds || "")
        .replace("{{wordLimit}}", data.wordLimit || "");
}

function convertSpeechPatterns(jsonString) {
    const speechPatterns = JSON.parse(jsonString).quotes;
    let result = '\n';

    for (const category in speechPatterns) {
        result += `${category}:\n\n`;
        speechPatterns[category].forEach(phrase => {
            result += `${phrase}\n`;
        });
        result += '\n';
    }

    return result.trim();
}

// Function to handle user input and generate a response
async function handleUserInput(userInput) {
    if (process.env.MOCK_MODE === "true") {
        console.log(config);
        return { content: "Placeholder response." };
    } else {
        try {
            let response = null
            if(!retrievalChain){
                response = await chain.invoke({ 
                    input : userInput 
                });
                console.log(response)
                console.log("Response:", response.text);
                return response.text;
            }
            else{
                response = await retrievalChain.invoke({
                    input: userInput
                })
                console.log(response.answer.content)
                return response.answer.content
            }
        } catch (error) {
            console.error("Error generating response:", error.message);
            throw new Error("Failed to generate a response");
        }
    }
}


module.exports = { handleUserInput, updateConfigWithMongoData, updateConfigWithChatHistory };