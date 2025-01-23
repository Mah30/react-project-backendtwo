const { req, res } = require("express");
const Booking = require("../models/Booking.model");
const mongoose = require('mongoose');
const Student = require ('../models/Student.model');
const Class = require ('../models/Class.model')
const router = require('express').Router();


/* bookings ROUTES */

//  GET  /api/bookings - Retrieve all bookings from the database collection
router.get("/", (req, res, next) => {
  Booking.find({})
  .populate('student', 'firstName lastName email') 
  .populate('class', 'name schedule') 
  .then((bookings) => {
    console.log("Retrieved bookings ->", bookings);
    res.status(200).json(bookings);
  })
  .catch((error) => {
    console.error("Error while retrieving bookings ->", error);
    next(error);
  });
});

// GET /:bookingId - Retrieves a specific booking by id
router.get('/:bookingId', async (req, res, next) => {
    const {bookingId} = req.params;
    if (mongoose.isValidObjectId(bookingId)) {
        try {
            const booking = await Booking.findById(bookingId).populate('student', 'firstName lastName email').populate('class', 'name schedule');
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    }   catch (error) {
            console.log(error);
            next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid Booking Id" });
  }
});


// POST /api/bookings - Creates a new booking
router.post('/', async (req, res, next) => {
  const { student, class: classId, date, status = "confirmed" } = req.body;

  // Validação IDs
  if (!mongoose.isValidObjectId(student) || !mongoose.isValidObjectId(classId)) {
    return res.status(400).json({ message: "Invalid Student ID or Class ID" });
  }

  // olha s estudan e aulas existem n banco de d
  try {
    const existingStudent = await Student.findById(student);
    const existingClass = await Class.findById(classId);

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!existingClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Valida data
    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Criação da reserva
    const createdBooking = await Booking.create({
      student,
      class: classId,
      date,
      status,
    });

    res.status(201).json({
      message: "Booking successfully created",
      booking: createdBooking,
    });
  } catch (error) {
    console.error("Error while creating the booking ->", error);
    next(error);
  }
});


// POST /api/bookings - Creates a new booking
    /* const {studentId, classId, date } = req.body;
    if (mongoose.isValidObjectId(studentId) && mongoose.isValidObjectId(classId)) {
     
      try {
        const createdBooking = new Booking({
          student: studentId,
          class: classId,
          date,
        });
        const savedBooking = await createdBooking.save();
        res.status(201).json(savedBooking);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Student Id or Class Id" });
    } */



// PUT /:bookingId - Updates a specific booking by id
router.put('/:bookingId', async (req, res, next) => {
    const { bookingId } = req.params;
    if (mongoose.isValidObjectId(bookingId)) {
      try {
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });
        if (!updatedBooking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(updatedBooking);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Booking Id" });
    }
  });



// DELETE /:bookingId - Deletes a specific booking by id
router.delete('/:bookingId', async (req, res, next) => {
    const { bookingId } = req.params;
    if (mongoose.isValidObjectId(bookingId)) {
      try {
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);
        if (!deletedBooking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      res.status(400).json({ message: "Invalid Booking Id" });
    }
  });




  module.exports = router;