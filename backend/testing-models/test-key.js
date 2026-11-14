require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

ai.models
  .generateContent({
    model: process.env.GEMINI_MODEL,
    contents: "Say hi",
  })
  .then((res) => console.log(res.text))
  .catch((err) => console.log(err.status, err.message));