
const express = require('express');
const request = require('request-promise');
const xlsx = require('xlsx');
const WordExtractor = require("word-extractor");
const Tesseract = require('tesseract.js');
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
        if (!req.body || !req.body.pdfBase64 || !req.params.extension ) {
          res.status(400);
          res.end();
         }
         const extension = req.params.extension;
      
      
  
      const FileBase64 = req.body.pdfBase64;
      
      
      const FileBuffer = Buffer.from(FileBase64, 'base64');
      if(extension == 'pdf'){
        pdfParse(FileBuffer).then(result => {
            res.send(result.text);
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).send("Error occurred during text extraction.");
          });
      }
      else if(extension == 'xlsx'){
        let wb = xlsx.read(FileBuffer, {type:'buffer'});
       try{
        let textData = xlsx.utils.sheet_to_txt(wb.Sheets[wb.SheetNames[0]]);
        textData = textData.replace(/[^a-zA-Z0-9 ]/g, "");
        res.send(textData);
       }
        catch(err){
          res.status(500).send("Error occurred during text extraction.");
        }

      }
      else if(extension == 'image'){
        Tesseract.recognize(
            FileBuffer,
            'eng',
            { logger: m => console.log(m) }
          ).then(({ data: { text } }) => {
            res.send(text);
          })
          .catch(err => {
            console.error('Error:', err);
            res.status(500).send("Error occurred during text extraction.");
          });
      }else if(extension == 'doc'){
        const extractor = new WordExtractor();
        const extracted = extractor.extract(FileBuffer);
        extracted.then(function(doc) {
             res.send(doc.getBody());
             })
             .catch(err => {
                console.error('Error:', err);
                res.status(500).send("Error occurred during text extraction.");
              });;
     }
      
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));