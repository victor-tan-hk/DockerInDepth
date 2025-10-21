// ------------------- Module Imports -------------------
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const express = require('express');

// ------------------- App Initialization -------------------
const app = express();


// ------------------- Middleware -------------------
// Parse URL-encoded bodies (replaces body-parser for forms)
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

// ------------------- Directory Setup -------------------
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log(`Directory '${dir}' created.`);
  }
};

ensureDirExists('temp');
ensureDirExists('feedback');

// ------------------- Routes -------------------

// GET / → Show feedback form
app.get('/', (req, res) => {
  console.log("Loaded main page");
  res.sendFile(path.join(__dirname, 'pages', 'feedback.html'));
});

// GET /exists → Duplicate title page
app.get('/exists', (req, res) => {
  console.log("Received request to store feedback for title that already exists");
  res.sendFile(path.join(__dirname, 'pages', 'exists.html'));
});

// POST /create → Handle feedback form submission
app.post('/create', async (req, res, next) => {
  try {
    console.log("Received request to store new feedback");

    const title = req.body.title?.toLowerCase();
    const content = req.body.text;

    if (!title || !content) {
      return res.status(400).send("Missing title or content");
    }

    const tempFilePath = path.join(__dirname, 'temp', `${title}.txt`);
    const finalFilePath = path.join(__dirname, 'feedback', `${title}.txt`);

    await fsp.writeFile(tempFilePath, content);

    const exists = fs.existsSync(finalFilePath);

    if (exists) {
      return res.redirect('/exists');
    }

    await fsp.copyFile(tempFilePath, finalFilePath);
    await fsp.unlink(tempFilePath);

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// ------------------- Start Server -------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App started and listening on port :${PORT}`);
});
