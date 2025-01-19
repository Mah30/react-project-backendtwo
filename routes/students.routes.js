const { request, response } = require("express");
const Student = require("../models/Student.model");
const mongoose = require('mongoose');
const Booking = require("../models/Booking.moodel");

const router = require('express').Router();



/* students ROUTES */

//  GET  /students - Retrieve all students from the database
router.get("/", (req, res, next) => {
    Student.find({})
        /* .populate("cohort") */
        .then((students) => {
            console.log("Retrieved students ->", students);

            res.status(200).json(students);
        })
        .catch((error) => {
            console.error("Error while retrieving students ->", error);
            next(error);
        });
});


//GET /api/students/:studentId - Retrieves a specific student by id
router.get('api/students/:studentId', async (request, response, next) => {
    const {studentId} = request.params
    if (mongoose.isValidObjectId(studentId)) {
        try{
            const oneStudent = await Student
            .findById(studentId)
            /* .populate("cohort") */
            if (!oneStudent){
                return response.status(404).json({message: "Student not found"});
            }
            response.status(200).json(oneStudent)
        } catch(error){
            console.log(error);
            next(error);
        }
    } else {
        response.status(400).json({message: 'Invalid Id'})
    }
});


//POST /api/students - Creates a new student
router.post('/', async (request, response, next) => {
    try {
        const newStudent = new Student.create(req.body)
        const savedStudent = await newStudent.save();

        res.status(201).json(savedStudent)
        
    } catch (error) {
        console.log(error);
        next(error)
    }
});


//PUT /api/students/:studentId - Updates a specific student by id
router.put('/api/students/:studentId', async (request, response, next) => {
    const { studentId } = request.params;
    if (mongoose.isValidObjectId(studentId)) {
      try {
        const updatedStudent = await Student.findByIdAndUpdate(studentId, 
            request.body, { 
                new: true,
                runValidators: true });
        if (!updatedStudent) {
          return response.status(404).json({ message: "Student not found" });
        }
        response.status(200).json(updatedStudent);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Id" });
    }
  });


//GET /api/students/booking/:bookingId - Retrieves all of the students for a given booking //(Isso é aqui mesmo?)
router.get('/api/students/booking/:bookingId', async (request, response, next) => {
    const { bookingId } = request.params;
    if (mongoose.isValidObjectId(bookingId)) {
      try {
        const bookings = await Booking.findById(bookingId).populate('user'); //catar populate //Booking n definido?
        if (!bookings) {
          return response.status(404).json({ message: "Booking not found" });
        }
        response.status(200).json(bookings);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Id" });
    }
  });


//* GET /api/students/:studentId/bookings - Retrieves(obtém) all bookings for a specific student 
router.get('api/students/:studentId/bookings', async (request, response, next) => {
    const { studentId } = request.params;
  if (mongoose.isValidObjectId(studentId)) {
    try {
      const bookings = await Booking.find({ user: studentId }).populate('class');
      if (!bookings.length) {
        return response.status(404).json({ message: "No bookings found for this student" });
      }
      response.status(200).json(bookings);
    } catch (error) {
      console.log(error);
      next(error);
    }
  } else {
    response.status(400).json({ message: "Invalid Id" });
  }
});


//DELETE /api/students/:studentId
router.delete('api/students/:studentId', async (request, response, next) => {
    const {studentId} = request.params
    if (mongoose.isValidObjectId(studentId)) {
      try {
        await Student.findByIdAndDelete(studentId)
        res.status(204).json() 
      } catch (error) {
        next(error)
      }
    } else {
      res.status(400).json({ message: 'invalid id' })
    }
  });
  


module.exports = router;
