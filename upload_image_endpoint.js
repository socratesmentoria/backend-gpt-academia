
const express = require("express");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: "upload/" });
const router = express.Router();

const chatConImagen = require("./chat_con_imagen");
router.use(upload.single("imagen"), chatConImagen);

module.exports = router;
