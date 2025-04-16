
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analizarImagenConIA(req, res) {
  try {
    const imagePath = req.file.path;
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");

    const result = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Ayúdame con este ejercicio de matemáticas" },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const respuesta = result.choices[0].message.content;
    res.json({ respuesta });
  } catch (error) {
    console.error("Error con GPT-4 Vision:", error);
    res.status(500).json({ error: "Error al procesar imagen con IA" });
  }
}

module.exports = analizarImagenConIA;
