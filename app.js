const express = require("express");
require ("dotenv").config()
const mongoose = require ("mongoose");
const configureApp = require("./config"); // Importa a configuração dos middlewares
const { isAuthenticated } = require("./middlewares/route-guard.middleware");
const withDB = require("./db")



// app.js
const app = express ();

require("./config")(app); // Configura middlewares globais


// Conecta ao banco e inicia o servidor
const PORT = process.env.PORT  || 3000;


/* Routes */
// 👇 Start handling routes here

//rotas de autenticacao
const authRoutes = require('./routes/auth.routes');
const { error } = require("console");
app.use('/auth', authRoutes)

const indexRoutes = require('./routes/index.routes')
app.use('/api', indexRoutes) 


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
 require('./error-handling')(app)  



// START SERVER - conexao com o MongoDB  // Esse codigo esta em serverjs e indexconfig? 
   mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/react-backendtwo-api")
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));
  })
  .catch(error => console.error("Error connecting to MongoDB", error));



  module.exports = app