const { req, res } = require("express");
const Booking = require("../models/Booking.model");
const mongoose = require('mongoose');
const Student = require ('../models/Student.model');
const Class = require ('../models/Class.model');
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const router = require('express').Router();


/* bookings ROUTES */

//  GET  /api/bookings - Retrieve all bookings from the database collection
 router.get("/", isAuthenticated, (req, res, next) => {
  if (!req.tokenPayload.isAdmin) {
    return res.status(403).json({ message: "Need admin permissions" });
  }

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


// GET /api/bookings/student - Retrieves all bookings for the authenticated student
router.get('/student', isAuthenticated, async (req, res, next) => {
  try {
    console.log("I'm here");
    const studentId = req.tokenPayload.studentId;

    // Encontra todas as reservas do estudante autenticado
    const bookings = await Booking.find({ student: studentId })
      .populate('class', 'name schedule duration') 
      .populate('student', 'firstName lastName email'); 

   /*  if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this student" });
    } */

    // Mesmo sem reservas, retorna lista vazia
    return res.status(200).json(bookings); // Retorna todas as reservas do estudante

  } catch (error) {
    console.error('Error retrieving student bookings ->', error.message);
    next(error);
  }
}); 


// GET /:bookingId - Retrieves a specific booking by id
router.get('/:bookingId', isAuthenticated, async (req, res, next) => {
  const {bookingId} = req.params;
  if (mongoose.isValidObjectId(bookingId)) {
    try {
      const booking = await Booking.findById(bookingId).populate('student', 'firstName lastName email').populate('class', 'name schedule');
      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }
      if (booking.student == req.tokenPayload.studentId || req.tokenPayload.isAdmin) {
        res.status(200).json(booking);
      } else {
        res.status(403).json({ message: "You cannot access a booking by another student. "});
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid Booking Id" });
  }
});


// POST /api/bookings - Creates a new booking
router.post('/', isAuthenticated, async (req, res, next) => {
  console.log("Request Body:", req.body);
  
  const { student, class: classId, date, status = "confirmed" } = req.body;



  // Validação IDs
  if (!mongoose.isValidObjectId(student) || !mongoose.isValidObjectId(classId)) {
    return res.status(400).json({ message: "Invalid Student ID or Class ID" });
  }

  if (!(student == req.tokenPayload.studentId || req.tokenPayload.isAdmin)) {
    return res.status(403).json({ message: "You cannot create a booking for another student!"});
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


// PUT /api/booking/:bookingId - Updates a specific booking by id
router.put('/:bookingId', isAuthenticated, async (req, res, next) => {
    const { bookingId } = req.params;

    if (!(req.body.student == req.tokenPayload.studentId || req.tokenPayload.isAdmin)) {
      return res.status(403).json({ message: "Cannot change the booking to another student." })
    }

    if (mongoose.isValidObjectId(bookingId)) {
      try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }

        if (!(booking.student == req.tokenPayload.studentId || req.tokenPayload.isAdmin)) {
          return res.status(403).json({ message: "Cannot update the bookings of another student" })
        }

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
router.delete('/:bookingId', isAuthenticated, async (req, res, next) => {
    const { bookingId } = req.params;
    if (mongoose.isValidObjectId(bookingId)) {
      try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }

        if (!(booking.student == req.tokenPayload.studentId || req.tokenPayload.isAdmin)) {
          return res.status(403).json({ message: "Cannot delete the bookings of another student" })
        }

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