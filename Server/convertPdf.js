const mongoose = require('mongoose');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const temp = multer({ dest: 'temp/' });
const bodyParser = require('body-parser');

const Pdf = require('./schemas/baseSchemas/PDF_File');
const { convertPdfToVector } = require('./pdfToVector'); // hypothetical function to convert PDF to vector

let currentPdf = null;
const DB_VECTORSTORE_PATH = 'vectorstore/dbtest.txt';

async function stageFile(id) {
    console.log(id);
    const file = await Pdf.findOne({ _id: id._id });
    console.log(file);

    if (!file) {
        console.log('File not found');
        return;
    }

    if (currentPdf && currentPdf._id.equals(file._id)) {
        console.log('File is the same as currentPdf, no action needed.');
    } else{
        currentPdf = file;
    }
    console.log('Updated currentPdf:', currentPdf);

    const pdfPath = path.join(__dirname, 'temp', 'vectorDb.pdf');
    fs.writeFileSync(pdfPath, file.pdfFile.data);

    console.log('Configured temp/vectorDb.pdf to the new file.');

    // Convert the PDF content to vector representation
    const vectorRepresentation = convertPdfToVector(file.pdfFile.data);

    // Store the vector representation in the vectorStore
    fs.writeFileSync(DB_VECTORSTORE_PATH, JSON.stringify(vectorRepresentation));

    console.log('Stored vector representation in vectorstore/dbtest.txt.');
}

module.exports = { stageFile };