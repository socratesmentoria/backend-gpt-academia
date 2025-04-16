
const fs = require("fs");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analizarImagenConIA(path) {
  try {
    const imageBuffer = fs.readFileSync(path);
    const base64Image = imageBuffer.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision",
      messages: [
        {
          role: "system",
          content: "Eres un profesor de matemáticas paciente y claro. Ayuda al alumno a entender el ejercicio de la imagen sin resolverlo directamente.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error con GPT-4 Vision:", error);
    return "⚠️ Error al procesar imagen con IA";
  }
}

module.exports = analizarImagenConIA;
