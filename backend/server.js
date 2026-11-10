const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
app.post('/api/convert', multer().single('file'), (req, res) => {
    const file = req.file;
    console.log('Received file name:', file.originalname);
    res.json({ latex: "This is a placeholder LaTeX output." });
});