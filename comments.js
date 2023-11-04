// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { json } = require('body-parser');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Read comments from file
const dataPath = path.join(__dirname, 'data', 'comments.json');
let comments = fs.readFileSync(dataPath, 'utf-8');
comments = JSON.parse(comments);

// Get comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// Add comment
app.post('/comments', (req, res) => {
    const comment = req.body;
    comment.id = uuidv4();
    comment.date = new Date();
    comments.push(comment);
    fs.writeFileSync(dataPath, JSON.stringify(comments));
    res.json(comment);
});

// Delete comment
app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    const index = comments.findIndex((comment) => comment.id === id);
    comments.splice(index, 1);
    fs.writeFileSync(dataPath, JSON.stringify(comments));
    res.json({ success: true });
});

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
