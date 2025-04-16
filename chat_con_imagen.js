
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

// Configuración de Multer para guardar archivos temporalmente
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.originalname.replace(/\s+/g, "_") + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("/analizar-imagen", upload.single("imagen"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ninguna imagen" });
    }

    const imageData = fs.readFileSync(req.file.path);
    const base64Image = imageData.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analiza esta imagen de un ejercicio de matemáticas y explica cómo resolverlo paso a paso:" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const respuesta = response.choices[0].message.content;
    res.json({ respuesta });
  } catch (error) {
    console.error("Error con GPT-4 Vision:", error);
    res.status(500).json({ error: "Error al procesar imagen con IA" });
  }
});

module.exports = router;
