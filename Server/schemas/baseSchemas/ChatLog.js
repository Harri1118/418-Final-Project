const mongoose = require("mongoose");

const ChatLogSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    chatBot:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chatbot"
    },
    messages:{
        type: String,
        required: true
    }
})

const ChatLog = mongoose.model('ChatLog', ChatLogSchema);

module.exports = ChatLog