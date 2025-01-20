const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { isAuthenticated } = require('../middlewares/route-guard.middleware') 


// POST /api/auth/signup - Rota de Cadastro
  router.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body; // Desestruturando credenciais

    // Validação básica de entrada
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // Verifica se o usuário já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

        // Gera o hash da senha
      const salt = bcrypt.genSaltSync(13);
      const passwordHash = bcrypt.hashSync(password, salt);
      
      // Cria o novo usuário
      const newUser = await User.create({ username, email, passwordHash });

      // Remove informações sensíveis (como hash da senha) antes de enviar a resposta
      const { passwordHash: _, ...userWithoutPassword } = newUser.toObject();
  
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  

  // POST /api/auth/login - Rota de Login
router.post('/login', async (req, res, next) => {
    const credentials = req.body // { username: '...', password: '...'} //talvez preciso substituir a credencial por username e passwort
  
        // Validação básica de entrada
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
  }
    // Check for user with given username
    try {
      const potentialUser = await User.findOne({ email }) //or username: credentials.username

      if (potentialUser) {

        // Check the password
        if (bcrypt.compareSync(credentials.password, potentialUser.passwordHash)) {
        
          // The user has the right credentials
          const payload = { userId: potentialUser._id }
          const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '6h',
          })
          res.json({ token: authToken })
        } else {
          res.status(403).json({ message: 'Incorrect password' })
        }
      } else {
        res.status(400).json({ message: 'No user with this username' })
      }
    } catch (error) {
      next(error)
    }
  })


  // GET /api/auth/verify - Rota de Verificação
  router.get('/verify', isAuthenticated, async (req, res, next) => {
    console.log('Log from handler')
    try {
         // Obtém o usuário atual de ac c/ ID do tokken
      const currentUser = await User.findById(req.tokenPayload.userId)
      if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
      res.json(currentUser)
    } catch (error) {
      next(error)
    }
  })
  
  module.exports = router
  