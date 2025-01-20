const express = require("express");
const mongoose = require ("mongoose");

/* const morgan = require("morgan"); */
/* const cors = require ("cors");

const cookieParser = require("cookie-parser");
const PORT = 5005; */


const configureApp = require("./config/index"); // Importa a configuração dos middlewares

// app.js
const app = express ();

require ("dotenv").config()


/* 
const PORT = 5005;
 */



// MIDDLEWARE
/* app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); */



/* Routes */
// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes) // rota base - isso provavelmente vem de uma '/api'?

const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
 require('./error-handling')(app)  // Saber como eu faco para importar/criar esse error-handling ?


// START SERVER
mongoose
  .connect(
    "mongodb://127.0.0.1:27017/react-backendtwo-api" // inserir aqui o endereco do meu banco de dados
  )
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    app.listen(3000, () => console.log('My first app listening on port http://localhost:3000'))
  })
  .catch(err => console.error('Error connecting to mongo', err))



  module.exports = app