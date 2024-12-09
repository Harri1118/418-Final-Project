import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    feedback: {type: String, required: true},
    createdAt: {type:Date, default:Date.now},
});

const FeedBack = mongoose.model('Feedback', feedbackSchema)

export default FeedBack;