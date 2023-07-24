
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
        if (!req.files && !req.files.pdfFile) {
          res.status(400);
          res.end();
      }
      const pdfFileBase64 = req.files.pdfFile.data.toString("base64");
  
      const pdfFileBuffer = Buffer.from(pdfFileBase64, "base64");

      pdfParse(pdfFileBuffer).then(result => {
          res.send(result.text);
      });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));