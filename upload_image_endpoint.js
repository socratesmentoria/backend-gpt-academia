const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Configuración para guardar archivos temporalmente
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uid = req.query.uid || "anonimo";
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${uid}_${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

// Ruta para subir imágenes
router.post("/upload-image", upload.single("imagen"), (req, res) => {
  const uid = req.query.uid || "anonimo";
  console.log(`📸 Imagen recibida de ${uid}:`, req.file.filename);
  res.send(`<h2>✅ Imagen subida correctamente</h2><p>Puedes cerrar esta página.</p>`);
});

module.exports = router;
