const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require("../models/Student.model");
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { isAuthenticated } = require('../middlewares/route-guard.middleware'); 


// POST /api/auth/signup - Rota de Cadastro
  router.post("/signup", async (req, res, next) => {
    const { firstName, lastName, email, password, age, phone } = req.body; 

    // Validação básica de entrada
    if (!firstName || !lastName  || !email || !password || !age || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // Verifica se o usuário já existe
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "Student already exists" });
      }

        // Gera o hash da senha
      const salt = bcrypt.genSaltSync(13);
      const passwordHash = bcrypt.hashSync(password, salt);
      
      // Cria o novo usuário
      const newStudent = await Student.create({ 
        firstName,
        lastName,
        age,
        phone,
        email,
        passwordHash, 
      });

      // Remove informações sensíveis (como hash da senha) antes de enviar a resposta
      const { passwordHash: _, ...studentWithoutPassword } = newStudent.toObject();
  
      res.status(201).json(studentWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  

  // POST /auth/login - Rota de Login
router.post('/login', async (req, res, next) => {

  const { email, password } = req.body // { username: '...', password: '...'} //talvez preciso substituir a credencial por username e passwort
  
        // Validação básica de entrada
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
  }
    // Check for user with given username
    try {
      const potentialStudent = await Student.findOne({ email }) //or username: credentials.username
      if (!potentialStudent) {
        return res.status(400).json({ message: 'No student with this email' });
    }

      if (potentialStudent) {
        // Check the password
        if (bcrypt.compareSync(password, potentialStudent.passwordHash)) {
        
          // The user has the right credentials
          const payload = { studentId: potentialStudent._id }
          const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '6h',
          });
          res.json({ token: authToken })
        } else {
          res.status(403).json({ message: 'Incorrect password' })
        }
      } 
    } catch (error) {
      next(error);
    }
  });


  // GET /api/auth/verify - Rota de Verificação
  router.get('/verify', isAuthenticated, async (req, res, next) => {

    try {
      // Obtém o usuário atual de acordo com o ID do token
      const currentStudent = await Student.findById(req.tokenPayload.studentId);
      if (!currentStudent) {
          return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json(currentStudent);
  } catch (error) {
      console.error('Error during verification:', error.message);
      next(error);
  }
  })
  
  module.exports = router
  