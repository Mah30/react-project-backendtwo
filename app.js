const express = require("express");
require ("dotenv").config()

const mongoose = require ("mongoose");
const configureApp = require("./config"); // Importa a configuração dos middlewares
const { isAuthenticated } = require("./middlewares/route-guard.middleware");




// app.js
const app = express ();

configureApp(app); // Configura middlewares globais


/* 
const PORT = 5005;
 */



/* Routes */
// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes) // rota base - isso provavelmente vem de uma '/api'?

//rotas de autenticacao
const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)


//rotas protegidas  //estao também no index.js router ... talvez transfiro para lá todas
const studentsRoutes = require("./routes/students.routes");
app.use("/students", isAuthenticated, studentsRoutes); // Rotas protegidas //Aqui é student ou students??

const bookingRoutes = require("./routes/booking.routes");
app.use("/bookings", isAuthenticated, bookingRoutesRoutes); // Rotas protegidas




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
 require('./error-handling')(app)  



// START SERVER - conexao com o MongoDB
  mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/react-backendtwo-api")
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));
  })
  .catch(err => console.error("Error connecting to MongoDB", err));



  module.exports = app