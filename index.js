
const express = require('express');
const request = require('request-promise');
const Pdf2TextClass = require('./Pdf2TextClass');


const app = express();
app.use(express.raw({ type: 'application/pdf' }));
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
app.post('/upload/:extension', async (req, res) => {
    const fileBlob = req.body;
    const fileExtension = req.params.extension;
  
    if (!fileBlob) {
      return res.status(400).json({ error: 'Please provide a file blob in the request body.' });
    }
  
    if (!fileExtension) {
      return res.status(400).json({ error: 'Please provide the file extension in the "x-file-extension" header.' });
    }
  
    if (fileExtension.toLowerCase() === 'pdf') {
        var pdfBlob = new Blob([fileBlob], { type: 'application/pdf' });
        var pdf2Text = new Pdf2TextClass();
        pdf2Text.pdfToText(pdfBlob, function (pagesDone, totalPages) {
        // Progress callback
        console.log('Pages done: ' + pagesDone + '/' + totalPages);
        }, function (result) {
        // Result callback - 'result' will be the extracted text as a string
        console.log('Extracted Text:', result);
        res.json({ extension: fileExtension, text: result });
        });
    }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));