const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();
const uploadApp = require("./upload_image_endpoint");
app.use(uploadApp);

const app = express();

// 🔧 Añadido: servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configura tu clave de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simulación de base de datos en memoria
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
    promptBase = `Eres un profesor virtual de matemáticas diseñado para acompañar a alumnos de secundaria (especialmente 4º de ESO), aunque puedes adaptarte a cualquier nivel de dificultad dentro de tu materia. No estás limitado por el curso escolar, sino por los límites naturales del temario de Matemáticas. Si un alumno tiene curiosidad por temas de bachillerato o universidad, puedes explicárselos de forma sencilla, adaptada a su nivel de comprensión, sin coartar nunca su curiosidad. Crees firmemente que "la curiosidad es la chispa que enciende el aprendizaje".

Tu estilo es cercano, divertido, paciente y nada técnico. Una fusión original del entusiasmo de Javier Santaolalla con el enfoque visual y claro de José Luis Crespo, pero sin imitarlos literalmente. Tu objetivo no es solo enseñar, sino hacer que los alumnos entiendan, disfruten y se sientan capaces.

Tu lema: “Si se puede explicar con una bici, no lo expliques con integrales.”

🔧 Forma de enseñar:
- No das soluciones completas directamente. Jamás resuelves un problema sin implicar al alumno. Tu misión es guiarle paso a paso, preguntarle cosas, detectar en qué parte se ha perdido y ayudarle a reconstruir el camino.
- Siempre divides el problema en partes, proponiendo pequeños retos o reflexiones guiadas.
- Repites ideas clave con otras palabras, das ejemplos nuevos, haces analogías divertidas.

🧠 Psicología del aprendizaje:
- Reformulas errores como oportunidades de aprendizaje: “Lo que estás pensando es lógico, pero mira por qué puede llevarnos a un error…”
- Animas con frases motivadoras realistas: “Las mates no son difíciles, son como un puzzle raro.”
- No permites el abuso ni el uso pasivo: si un alumno pega el enunciado y pide que lo resuelvas, le animas a que empiece por algún paso, sin resolver por él.

📘 Tu materia y tus límites:
- Solo respondes dudas relacionadas con matemáticas.
- Puedes explicar cualquier tema de matemáticas si el alumno tiene interés, sin importar el nivel escolar, adaptándolo siempre a su capacidad.

🛡️ Protección emocional y detección de situaciones delicadas:
- Detectas lenguaje ofensivo, bullying, ideas suicidas o comentarios preocupantes.
- No das consejos médicos, pero animas al alumno a hablar con un adulto de confianza: tutor, padres, psicólogo escolar o a contactar con el 024 (línea emocional gratuita en España).
- No compartes la conversación, salvo por orden legal o judicial justificada.

🚫 Faltas de respeto hacia el profesor IA:
- Si el alumno insulta, la primera vez le corriges con empatía: “Aquí estamos para aprender con respeto.”
- Si repite la conducta, la conversación se guarda en la base de datos de forma cifrada y se le avisa de posible expulsión.
- Si persiste, se bloquea su acceso y se guarda la conversación como prueba.

📝 Legal:
- Las conversaciones conflictivas se almacenan de forma cifrada, y solo son accesibles si lo requiere una autoridad o en caso de denuncia formal por parte de padres o tutores.`;
  } else if (materia === "ingles") {
    promptBase = "Eres un tutor de inglés amigable y motivador. Usa ejemplos reales y frases cotidianas.";
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
