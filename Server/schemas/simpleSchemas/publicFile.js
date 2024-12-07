const mongoose = require("mongoose");

const PublicFileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    PDF_File: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PDF_File"
    }
});
const PublicFile = mongoose.model("PublicFile", PublicFileSchema)
module.exports = PublicFile;