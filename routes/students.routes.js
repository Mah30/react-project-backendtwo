const Student = require("../models/Student.model");
const mongoose = require('mongoose');

const router = require('express').Router();



/* students ROUTES */

//  GET  /students - Retrieve all students from the database

router.get('/', (req, res) => {
    res.json('Students route working!');
});


//GET /api/students/:studentId - Retrieves a specific student by id





//POST /api/students - Creates a new student





//PUT /api/students/:studentId - Updates a specific student by id





//GET /api/students/booking/:bookingId - Retrieves all of the students for a given booking






module.exports = router;
