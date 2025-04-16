
const express = require("express");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analizarImagenConIA(imagenPath) {
  const base64Image = fs.readFileSync(imagenPath, { encoding: "base64" });
  const imageData = `data:image/jpeg;base64,${base64Image}`;

  const result = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", content: "Resuelve el ejercicio de mates de esta imagen, explicándolo paso a paso para un estudiante de secundaria:" },
          { type: "image_url", image_url: { url: imageData } },
        ],
      },
    ],
  });

  return result.choices[0].message.content;
}

router.post("/api/chat_imagen", async (req, res) => {
  const imagenPath = req.body.imagenPath;
  if (!imagenPath) return res.status(400).json({ error: "Falta el path de la imagen" });

  try {
    const respuesta = await analizarImagenConIA(imagenPath);
    res.json({ respuesta });
  } catch (error) {
    console.error("Error con GPT-4 Vision:", error);
    res.status(500).json({ error: "Error al procesar imagen con IA" });
  }
});

module.exports = router;
