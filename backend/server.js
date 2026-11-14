const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.use(cors());
app.use(express.json());

const PROMPTtxt =
  "Convert the following text to LaTeX. " +
  "Return only the LaTeX code, with no explanations and no markdown code fences.";
const PROMPTimg =
  "Convert the content of this image to LaTeX. " +
  "Reproduce everything exactly as it appears, in the same order, without solving, summarizing, or correcting anything. " +
  "Use math mode for equations (inline $...$, display \\[...\\], and aligned for multi-line equations). " +
  "Use tabular for tables, itemize or enumerate for lists, and \\section for headings. " +
  "If a part is unclear, give your best guess followed by % unclear. " +
  "If the image contains a figure or diagram that can't be transcribed, write a comment like % figure: short description. " +
  "Output a complete, compilable document: start with \\documentclass{article}, include \\usepackage{amsmath, amssymb, amsfonts, graphicx}, " +
  "then \\begin{document} ... \\end{document}. " +
  "Return only the LaTeX code, with no explanations and no code fences.";
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
app.post('/api/convert', multer().single('file'), async (req, res) => {
    try{const file = req.file;
    console.log('Received file name:', file.originalname);
    //this is for a .txt
    /*const text = file.buffer.toString('utf-8');
    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL,
        contents: `${PROMPTtxt}\n\n${text}`,});*/
  //this for an image
    console.log('image buffer length:', file.buffer.length);
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: [
        { inlineData: { mimeType: file.mimetype, data: file.buffer.toString("base64") } },
        { text: PROMPTimg },
      ],
    });
    console.log('Generated LaTeX:', response.text);
    res.json({latex: response.text});
    //res.json({ latex: response.text });
} catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file' });
}
});