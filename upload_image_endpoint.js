
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadApp = express.Router();

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta POST para recibir la imagen
uploadApp.post("/api/upload-image", upload.single("imagen"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ninguna imagen." });
  }

  console.log("Imagen recibida:", req.file.filename);
  res.json({ mensaje: "Imagen recibida correctamente." });
});

module.exports = uploadApp;
