
const express = require("express");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const visionApp = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

visionApp.post("/api/chat-con-imagen", async (req, res) => {
  const { usuario_id, nombre_archivo } = req.body;
  if (!usuario_id || !nombre_archivo) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const rutaImagen = path.join(__dirname, "uploads", nombre_archivo);
  if (!fs.existsSync(rutaImagen)) {
    return res.status(404).json({ error: "Imagen no encontrada." });
  }

  const imageBase64 = fs.readFileSync(rutaImagen, { encoding: "base64" });
  const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Eres un profesor virtual de matemáticas. Ayuda al alumno a resolver el ejercicio de la imagen que ha subido. No resuelvas directamente, guía paso a paso como un buen mentor."
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const respuesta = response.choices[0].message.content;
    res.json({ respuesta });

  } catch (error) {
    console.error("Error con GPT-4 Vision:", error);
    res.status(500).json({ error: "Error al procesar imagen con IA" });
  }
});

module.exports = visionApp;
