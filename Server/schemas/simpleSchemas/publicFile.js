const mongoose = require("mongoose");

const PublicFileSchema = new mongoose.Schema({
    PDF_File: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PDF_File"
    }
});
const PublicFile = mongoose.model("PublicFile", PublicFileSchema)
module.exports = PublicFile;