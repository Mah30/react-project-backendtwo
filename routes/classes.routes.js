const { req, res } = require("express");
const Class = require("../models/Class.model");
const mongoose = require('mongoose');
const Student = require('../models/Student.model');
const Booking = require('../models/Booking.model');
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const router = require('express').Router();


/* classes ROUTES */

//  GET  /api/classes - Retrieve all classes from the database collection
router.get("/", (req, res, next) => {
    Class.find({})
         .populate("bookings") 
        .then((classes) => {
            console.log("Retrieved classes ->", classes);
  
            res.status(200).json(classes);
        })
        .catch((error) => {
            console.error("Error while retrieving classes ->", error);
            next(error);
        });
  });


// GET /api/classes/:classId - Retrieves a specific class by id
router.get('/:classId', isAuthenticated, async (req, res, next) => {
    const { classId } = req.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const oneClass = await Class.findById(classId).populate('bookings', 'student date status');
        if (!oneClass) {
          return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json(oneClass);
      } catch (error) {
        console.error('Error retrieving class ->', error);
        next(error);
      }
    } else {
      res.status(400).json({ message: 'Invalid Class ID' });
    }
  });


// POST /api/classes - Creates a new class
router.post('/', isAuthenticated, async (req, res, next) => {
  if (!req.tokenPayload.isAdmin) {
    return res.status(403).json({ message: "Need admin permissions" });
  }
    try {
        const createdClass = await Class.create({
            name: req.body.name,
            capacity: req.body.capacity,
            schedule: req.body.schedule,
            duration: req.body.duration,
            bookings: req.body.bookings,
            description: req.body.description,
            image: req.body.image, 
        });

        console.log("Class added ->", createdClass);

        res.status(201).json(createdClass);
    } catch (error) {
        console.error("Error while creating the class ->", error);
        next(error); 
    }
});


// PUT /api/classes/:classId - Updates a specific class by id
router.put('/:classId', isAuthenticated, async (req, res, next) => {
  if (!req.tokenPayload.isAdmin) {
    return res.status(403).json({ message: "Need admin permissions" });
  }
    const { classId } = req.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const updatedClass = await Class.findByIdAndUpdate(classId, 
            req.body, { 
                new: true,
                runValidators: true });
        if (!updatedClass) {
          return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json(updatedClass);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Class Id" });
    }
  });


//* GET /api/classes/:classId/bookings - Retrieves all bookings for a specific class - detalhes das reservas como data, horario
router.get('/:classId/bookings', isAuthenticated, async (req, res, next) => {
  if (!req.tokenPayload.isAdmin) {
    return res.status(403).json({ message: "Need admin permissions" });
  }
    const { classId } = req.params;

    if (!mongoose.isValidObjectId(classId)) {
    return res.status(400).json({ message: "Invalid Class ID" });
  }

  try {
    const bookings = await Booking.find({ class: classId })
      .populate('student', 'firstName lastName email')
      .populate('class', 'name schedule');

    
    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this class" });
    }

    res.status(200).json({
      bookings: bookings.map((booking) => ({
        student: booking.student,
        class: booking.class.name,
        schedule: booking.class.schedule,
        date: booking.date,
        status: booking.status,
      })),
      totalBookings: bookings.length,
    });
  } catch (error) {
    console.error('Error retrieving bookings for class ->', error.message);
    next(error);
  }
});
  

                                                                                            //esses dois nao sao a mesma coisa? - sao bem parecidos, tvz juntar as rotas?

//* GET /api/classes/:classId/students - Retrieves all students booked for a specific class - quais alunos reservaram uma aula
/* router.get('/:classId/students', async (req, res, next) => {
    const { classId } = req.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const bookings = await Booking.find({ class: classId }).populate('student', 'firstName lastName email'); //confirmar se esta mesmo certo aqui
        if (!bookings.length) {
          return res.status(404).json({ message: "No students found for this class" });
        }
        const students = bookings.map((booking) => booking.student); //catar map
        res.status(200).json(students);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Class Id" });
    }
  }); */



// POST /api/classes/:classId/bookings - Creates a new booking for a specific class //modificar o código
router.post('/:classId/bookings', isAuthenticated, async (req, res, next) => {
  const { classId } = req.params; 
  const { studentId, date } = req.body; 

  if (!mongoose.isValidObjectId(classId) || !mongoose.isValidObjectId(studentId)) {
    return res.status(400).json({ message: "Invalid Class ID or Student ID" });
  }

  if (!(student == req.tokenPayload.studentId || req.tokenPayload.isAdmin)) {
    return res.status(403).json({ message: "You cannot create a booking for another student!"});
  }

  try {
    const newBooking = new Booking({
      student: studentId,
      class: classId,
      date,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking ->", error);
    next(error);
  }
});



// DELETE /api/classes/:classId - Deletes a specific class by id
router.delete('/:classId', isAuthenticated, async (req, res, next) => {
  if (!req.tokenPayload.isAdmin) {
    return res.status(403).json({ message: "Need admin permissions" });
  }
    const { classId } = req.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const deletedClass = await Class.findByIdAndDelete(classId);
        if (!deletedClass) {
          return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json({ message: "Class deleted successfully" });
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Class Id" });
    }
  });
  

  module.exports = router;