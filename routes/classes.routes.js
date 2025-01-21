const { req, res } = require("express");
const Class = require("../models/Class.model");
const mongoose = require('mongoose');
const Student = require('../models/Student.model')  // ele mandou botar isso aqui
const router = require('express').Router();


/* classes ROUTES */

//  GET  api/classes - Retrieve all classes from the database collection
router.get("/", (req, res, next) => {
    Student.find({})
        /* .populate("cohort") */ //ver se precisa populate aqui
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
router.get('/api/classes/:classId', async (req, res, next) => {
    const { classId } = req.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const oneClass = await Class.findById(classId).populate('bookings');
        if (!oneClass) {
          return res.status(404).json({ message: "Class not found" });
        }
        res.status(200).json(oneClass);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Id" });
    }
  });


// POST /api/classes - Creates a new class
router.post('api/classes', async (req, res, next) => {
    try {
        const createdClass = await Class.create({
            name: req.body.name,
            instructor: req.body.instructor,
            capacity: req.body.capacity,
            schedule: req.body.schedule,
            image: req.body.image,
            duration: req.body.duration,
            bookings: req.body.bookings,
        });

        console.log("Class added ->", createdClass);

        res.status(201).json(createdClass);
    } catch (error) {
        console.error("Error while creating the student ->", error);
        next(error); 
    }
});



// PUT /api/classes/:classId - Updates a specific class by id
router.put('/api/classes/:classId', async (req, res, next) => {
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
      res.status(400).json({ message: "Invalid Id" });
    }
  });


//* GET /api/classes/:classId/bookings - Retrieves all bookings for a specific class - detalhes das reservas como data, horario
router.get('api/classes/:classId/bookings', async (req, res, next) => {
    const { classId } = req.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const bookings = await Booking.find({ class: classId }).populate('user', 'name email').populate('class', 'name schedule'); 
        if (!bookings.length) {
          return res.status(404).json({ message: "No bookings found for this class" });
        }

        // Retorna a lista de estudantes e o número total  //.json(bookings);
        res.status(200).json({
          students: bookings.map((booking) => booking.user),
          totalStudents: bookings.length,
        });
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Class Id" });
    }
  });
  

                                                                                            //esses dois nao sao a mesma coisa? - sao bem parecidos, tvz juntar as rotas?

//* GET /api/classes/:classId/students - Retrieves all students booked for a specific class - quais alunos reservaram uma aula
router.get('/api/classes/:classId/students', async (req, res, next) => {
    const { classId } = req.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const bookings = await Booking.find({ class: classId }).populate('user', 'name email'); //confirmar se esta mesmo certo aqui
        if (!bookings.length) {
          return res.status(404).json({ message: "No students found for this class" });
        }
        const students = bookings.map((booking) => booking.user); //catar map
        res.status(200).json(students);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Class Id" });
    }
  });



// POST /api/classes/:classId/bookings - Creates a new booking for a specific class //modificar o código
router.post('/api/classes/:classId/bookings', async (req, res, next) => {
    const { classId } = req.params; //catar
    const { userId, date } = req.body; //catar
    if (mongoose.isValidObjectId(classId) && mongoose.isValidObjectId(userId)) {
      try {
        const newBooking = new Booking({
          user: userId,
          class: classId,
          date,
        });
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Class Id or User Id" });
    }
  });
  

// DELETE /api/classes/:classId - Deletes a specific class by id
router.delete('/api/classes/:classId', async (req, res, next) => {
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