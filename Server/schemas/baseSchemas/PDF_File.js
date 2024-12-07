const mongoose = require('mongoose');

// Define the schema
const pdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  pdfFile: {
    data: Buffer,
    contentType: String
  }
});

// Create the model
const Pdf = mongoose.model('PDF_File', pdfSchema);

module.exports = Pdf;