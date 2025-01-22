const { req, res } = require("express");
const Booking = require("../models/Booking.model");
const mongoose = require('mongoose');
const Student = require ('../models/Student.model');
const router = require('express').Router();



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


// GET /api/bookings/:bookingId - Retrieves a specific booking by id
router.get('/api/bookings/:bookingId', async (req, res, next) => {
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
router.post('/api/bookings', async (req, res, next) => {
  const { student, class: classId, date, status } = req.body;
  
  if (!mongoose.isValidObjectId(student) || !mongoose.isValidObjectId(classId)) {
    return res.status(400).json({ message: "Invalid Student ID or Class ID" });
  }

  try {
    const createdBooking = await Booking.create({
        student: req.body.student,
        class: req.body.class,
        date: req.body.date,
        status: req.body.status,
    });

    console.log("Booking added ->", createdBooking);

    res.status(201).json(createdBooking);
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



// PUT /api/bookings/:bookingId - Updates a specific booking by id
router.put('/api/bookings/:bookingId', async (req, res, next) => {
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



// DELETE /api/bookings/:bookingId - Deletes a specific booking by id
router.delete('/api/bookings/:bookingId', async (req, res, next) => {
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