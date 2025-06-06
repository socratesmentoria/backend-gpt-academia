
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();
const uploadApp = require("./upload_image_endpoint");

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(uploadApp);

const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const historialUsuarios = {};

app.post("/api/chat", async (req, res) => {
  const { usuario_id, mensaje, materia } = req.body;
  if (!usuario_id || !mensaje || !materia) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  if (!historialUsuarios[usuario_id]) {
    historialUsuarios[usuario_id] = [];
  }

  let promptBase = "";
  if (materia === "matematicas") {
    promptBase = `Eres un profesor virtual de matemáticas...`;
  } else if (materia === "ingles") {
    promptBase = "Eres un tutor de inglés amigable y motivador.";
  } else {
    promptBase = "Eres un profesor virtual paciente y claro.";
  }

  const mensajes = [
    { role: "system", content: promptBase },
    ...historialUsuarios[usuario_id].slice(-10),
    { role: "user", content: mensaje },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: mensajes,
    });

    const respuesta = completion.choices[0].message.content;

    historialUsuarios[usuario_id].push({ role: "user", content: mensaje });
    historialUsuarios[usuario_id].push({ role: "assistant", content: respuesta });

    res.json({ respuesta });
  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor GPT funcionando en puerto ${PORT}`);
});
