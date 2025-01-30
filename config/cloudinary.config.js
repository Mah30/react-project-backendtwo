// Importação dos pacotes necessários para o Cloudinary funcionar
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuração do Cloudinary com as credenciais do arquivo .env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Configuração do armazenamento no Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'classes-images', // Pasta onde as serao armazenadas
    allowed_formats: ['jpg', 'png'], 
    public_id: (req, file) => file.originalname, 
  }
});


const upload = multer({ storage });

module.exports = upload;
