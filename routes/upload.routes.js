const express = require("express");
const router = express.Router();
const upload = require("../config/cloudinary.config"); // Importa a configuração do Cloudinary

//POST Rota para upload de imagem, vinda do usuário (student/isAdmin)
router.post("/", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  res.json({ imageUrl: req.file.path }); // Retorna a URL da imagem armazenada no Cloudinary
});

module.exports = router;
