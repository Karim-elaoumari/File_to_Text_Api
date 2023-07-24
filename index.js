
const express = require('express');
const request = require('request-promise');

const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(fileUpload());
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
app.post('/upload/:extension', async (req, res) => {
    const { url } = req.body;

    if (!url) {
      res.status(400).send('File URL not provided.');
      return;
    }
  
    
      const pdfFileBuffer = await downloadFile(url);
      pdfParse(pdfFileBuffer).then(result => {
        res.send(result.text);
      });
    

     
});
function downloadFile(url) {
    const options = {
      uri: url,
      encoding: null // This ensures the response body is returned as a Buffer
    };
    return request.get(options);
  }
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));