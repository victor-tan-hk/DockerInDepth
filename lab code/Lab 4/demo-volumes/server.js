const basicfs = require('fs');
const fs = require('fs').promises;
const exists = require('fs').exists;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

if (!basicfs.existsSync("temp")) {
  basicfs.mkdirSync("temp");
  console.log(`Directory temp created to hold temporary files.`);
} 

if (!basicfs.existsSync("feedback")) {
  basicfs.mkdirSync("feedback");
  console.log(`Directory feedback created to hold permanent files.`);
} 


app.get('/', (req, res) => {
  console.log("Loaded main page");
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  console.log("Received request to store feeback for title that already exists");

  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {

  console.log("Received request to store new feedback");

  const title = req.body.title;
  const content = req.body.text;

  const adjTitle = title.toLowerCase();

  const tempFilePath = path.join(__dirname, 'temp', adjTitle + '.txt');
  const finalFilePath = path.join(__dirname, 'feedback', adjTitle + '.txt');

  await fs.writeFile(tempFilePath, content);
  exists(finalFilePath, async (exists) => {
    if (exists) {
      res.redirect('/exists');
    } else {

      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath);
      res.redirect('/');

    }
  });
});

console.log("App started and listening for requests")

app.listen(80);
