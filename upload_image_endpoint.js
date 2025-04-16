
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { analizarImagenConIA } = require("./chat_con_imagen");

const uploadApp = express.Router();
const upload = multer({ dest: "upload/" });

uploadApp.post("/subir", upload.single("imagen"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const fileName = req.file.originalname;

    const respuestaIA = await analizarImagenConIA(imagePath);

    res.send(`✅ Imagen subida correctamente<br>Nombre: ${fileName}<br><br>🧠 Respuesta del profesor:<br>${respuestaIA}`);
  } catch (error) {
    console.error("Error en subida:", error);
    res.status(500).json({ error: "❌ Error al procesar la imagen" });
  }
});

module.exports = uploadApp;
