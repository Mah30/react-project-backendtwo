const { request, response } = require("express");
const Booking = require("../models/Booking.model");
const mongoose = require('mongoose');

const router = require('express').Router();



//  GET  api/bookings - Retrieve all bookings from the database collection
router.get("/", (req, res, next) => {
  Student.find({})
      /* .populate("cohort") */ //ver se precisa populate aqui
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
router.get('/api/bookings/:bookingId', async (request, response, next) => {
    const {bookingId} = request.params;
    if (mongoose.isValidObjectId()) {
        try {
            const booking = await Booking.findById(bookingId).populate('user', 'name email').populate('class', 'name schedule');
            if (!booking) {
                return response.status(404).json({ message: "Booking not found" });
      }
      response.status(200).json(booking);
    }   catch (error) {
            console.log(error);
            next(error);
    }
  } else {
    response.status(400).json({ message: "Invalid Booking Id" });
  }
});


// POST /api/bookings - Creates a new booking
router.post('/api/bookings', async (request, response, next) => {
    const { userId, classId, date } = request.body;
    if (mongoose.isValidObjectId(userId) && mongoose.isValidObjectId(classId)) {
     
      try {
        const createdBooking = new Booking({
          user: userId,
          class: classId,
          date,
        });
        const savedBooking = await createdBooking.save();
        response.status(201).json(savedBooking);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid User Id or Class Id" });
    }
  });


// PUT /api/bookings/:bookingId - Updates a specific booking by id
router.put('/api/bookings/:bookingId', async (request, response, next) => {
    const { bookingId } = request.params;
    if (mongoose.isValidObjectId(bookingId)) {
      try {
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, request.body, { new: true });
        if (!updatedBooking) {
          return response.status(404).json({ message: "Booking not found" });
        }
        response.status(200).json(updatedBooking);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Booking Id" });
    }
  });



// DELETE /api/bookings/:bookingId - Deletes a specific booking by id
router.delete('/api/bookings/:bookingId', async (request, response, next) => {
    const { bookingId } = request.params;
    if (mongoose.isValidObjectId(bookingId)) {
      try {
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);
        if (!deletedBooking) {
          return response.status(404).json({ message: "Booking not found" });
        }
        response.status(200).json({ message: "Booking deleted successfully" });
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Booking Id" });
    }
  });




  module.exports = router;