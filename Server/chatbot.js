// Install dependencies
// npm install @langchain/openai dotenv openai
// npm install body-parser
// npm install express
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables first

const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { LLMChain } = require('langchain/chains');


const chatBot = new ChatOpenAI({
    model: "gpt-4",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

// Define the template with placeholders
const template = `
    You are a chatbot with the following configuration:
    Name: {{name}}
    Purpose: {{purpose}}
    Audience: {{audience}}
    Language Styles: {{languageStyle}}
    Personality Traits: {{personalityTraits}}
    Key Functions: {{keyFunctions}}
    Speech Patterns: \n{{speechPatterns}}
    Fallback Behavior: {{fallbackBehavior}}
    Knowledge Level: {{knowledgeLevel}}
    Privacy Needs: {{privacyNeeds}}
    
    Now, answer the following question:
    {question}
`;

let prompt = PromptTemplate.fromTemplate(template);

// Create the LLMChain with the initial prompt
const chain = new LLMChain({
    llm: chatBot,
    prompt: prompt
});

function updateConfigWithMongoData(configData) {
    try {
        console.log(configData[0].speechPatterns);
        const promptString = mapTemplateToData(template, configData[0]);
        console.log(promptString);
        const prompt = PromptTemplate.fromTemplate(promptString); // Update the prompt template with new data
        chain.prompt = prompt; // Recreate the chain with updated prompt
    } catch (error) {
        console.error("Error updating config with MongoDB data:", error.message);
    }
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
        .replace("{{fallbackBehavior}}", data.fallbackBehavior || "")
        .replace("{{knowledgeLevel}}", data.knowledgeLevel || "")
        .replace("{{privacyNeeds}}", data.privacyNeeds || "");
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
            // Pass the user input as a question
            console.log(chain)
            if(typeof userInput == "string")
                console.log("it's a string.");
            const response = await chain.invoke({ question : userInput });
            console.log(response)
            console.log("Response:", response.text);
            return response;
        } catch (error) {
            console.error("Error generating response:", error.message);
            throw new Error("Failed to generate a response");
        }
    }
}


module.exports = { handleUserInput, updateConfigWithMongoData };