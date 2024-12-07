const mongoose = require('mongoose');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const temp = multer({ dest: 'temp/' });
const bodyParser = require('body-parser');

const Pdf = require('./schemas/baseSchemas/PDF_File')

async function stageFile(id){
    console.log(id)
    const file = Pdf.findOne({_id : id._id})
    console.log(file)
}

module.exports = {stageFile};