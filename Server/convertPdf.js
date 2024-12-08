const fs = require("fs")
const path = require('path');

let currentPdf = null;

const Pdf = require('./schemas/baseSchemas/PDF_File');

async function stageFile(id) {
    let file = await Pdf.findOne({ _id: id._id });

    if (!file) {
        console.log('File not found');
        return;
    }

    if (currentPdf && currentPdf._id.equals(file._id)) {
        console.log('File is the same as currentPdf, no action needed.');
    } else {
        currentPdf = file;
        const pdfPath = path.join(__dirname, 'temp', 'vectorDb.pdf');
        fs.writeFileSync(pdfPath, file.pdfFile.data);
        console.log('Configured temp/vectorDb.pdf to the new file.');
    }
}



module.exports = { stageFile };