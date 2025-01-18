const express = require('express');
const router = express.Router();



const studentsRoutes = require('./students.routes');
console.log('Exportação de students.routes:', studentsRoutes); // retirar isso depois

router.use('/students', studentsRoutes);


router.get('/', (request, response, next) => {
    response.json('All good in here')
});







module.exports = router;