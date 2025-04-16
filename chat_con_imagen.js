
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analizarImagenConIA(rutaImagen) {
  const imageData = fs.readFileSync(rutaImagen).toString("base64");

  try {
    const respuesta = await openai.chat.completions.create({
      model: "gpt-4-vision",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analiza esta imagen y explica su contenido como si fueras un profesor de matemáticas para un alumno de secundaria.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    });

    return respuesta.choices[0].message.content;
  } catch (error) {
    console.error("Error con GPT-4 Vision:", error);
    throw new Error("Error al procesar imagen con IA");
  }
}

module.exports = analizarImagenConIA;
