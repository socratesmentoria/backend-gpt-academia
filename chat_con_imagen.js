
const fs = require("fs");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analizarImagenConIA(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analiza el ejercicio de matemáticas de esta imagen y explícamelo paso a paso como a un alumno de 15 años." },
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

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error con GPT-4 Vision:", error);
    throw new Error("Error al procesar imagen con IA");
  }
}

module.exports = { analizarImagenConIA };
