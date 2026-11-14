const { config } = require("dotenv");
config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// skip models that aren't relevant for text/vision -> LaTeX
const SKIP = /image|embedding|deep-research|antigravity|nano-banana/i;

async function main() {
  const models = [];
  for await (const m of await ai.models.list()) {
    if (m.supportedActions?.includes("generateContent") && !SKIP.test(m.name)) {
      models.push(m.name.replace("models/", ""));
    }
  }

  console.log(`Testing ${models.length} models...\n`);

  for (const model of models) {
    let status;
    try {
      await ai.models.generateContent({
        model,
        contents: "Reply with: ok",
        config: { maxOutputTokens: 20 },
      });
      status = "FREE (works)";
    } catch (err) {
      const msg = String(err.message || err);
      if (err.status === 429 && /limit:\s*0/.test(msg)) status = "NOT FREE (quota 0)";
      else if (err.status === 429) status = "FREE, but rate-limited right now";
      else if (err.status === 403) status = "NOT ALLOWED for this key";
      else if (err.status === 404) status = "NOT AVAILABLE";
      else status = `ERROR ${err.status ?? ""}`;
    }
    console.log(model.padEnd(36), status);
    await sleep(1500); // stay under the per-minute limit
  }
}

main();