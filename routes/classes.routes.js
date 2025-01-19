const { request, response } = require("express");
const Class = require("../models/Class.model");
const mongoose = require('mongoose');

const router = require('express').Router();


/* classes ROUTES */
// GET /api/classes/:classId - Retrieves a specific class by id
router.get('/api/classes/:classId', async (request, response, next) => {
    const { classId } = request.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const oneClass = await Class.findById(classId).populate('bookings');
        if (!oneClass) {
          return response.status(404).json({ message: "Class not found" });
        }
        response.status(200).json(oneClass);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Id" });
    }
  });


// POST /api/classes - Creates a new class
router.post('api/classes', async (request, response, next) => {
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

        response.status(201).json(createdClass);
    } catch (error) {
        console.error("Error while creating the student ->", error);
        next(error); 
    }
});



// PUT /api/classes/:classId - Updates a specific class by id
router.put('/api/classes/:classId', async (request, response, next) => {
    const { classId } = request.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const updatedClass = await Class.findByIdAndUpdate(classId, 
            request.body, { 
                new: true,
                runValidators: true });
        if (!updatedClass) {
          return response.status(404).json({ message: "Class not found" });
        }
        response.status(200).json(updatedClass);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Id" });
    }
  });


//* GET /api/classes/:classId/bookings - Retrieves all bookings for a specific class - detalhes das reservas como data, horario
router.get('api/classes/:classId/bookings', async (request, response, next) => {
    const { classId } = request.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const bookings = await Booking.find({ class: classId }).populate('user', 'name email').populate('class', 'name schedule'); //confirmar se esta mesmo certo aqui
        if (!bookings.length) {
          return response.status(404).json({ message: "No bookings found for this class" });
        }
        response.status(200).json(bookings);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Class Id" });
    }
  });
  

                                                                                            //esses dois nao sao a mesma coisa? - sao bem parecidos, tvz juntar as rotas?

//* GET /api/classes/:classId/students - Retrieves all students booked for a specific class - quais alunos reservaram uma aula
router.get('/api/classes/:classId/students', async (request, response, next) => {
    const { classId } = request.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const bookings = await Booking.find({ class: classId }).populate('user', 'name email'); //confirmar se esta mesmo certo aqui
        if (!bookings.length) {
          return response.status(404).json({ message: "No students found for this class" });
        }
        const students = bookings.map((booking) => booking.user); //catar map
        response.status(200).json(students);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Class Id" });
    }
  });



// POST /api/classes/:classId/bookings - Creates a new booking for a specific class //modificar o código
router.post('/api/classes/:classId/bookings', async (request, response, next) => {
    const { classId } = request.params; //catar
    const { userId, date } = request.body; //catar
    if (mongoose.isValidObjectId(classId) && mongoose.isValidObjectId(userId)) {
      try {
        const newBooking = new Booking({
          user: userId,
          class: classId,
          date,
        });
        const savedBooking = await newBooking.save();
        response.status(201).json(savedBooking);
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Class Id or User Id" });
    }
  });
  

// DELETE /api/classes/:classId - Deletes a specific class by id
router.delete('/api/classes/:classId', async (request, response, next) => {
    const { classId } = request.params;
    if (mongoose.isValidObjectId(classId)) {
      try {
        const deletedClass = await Class.findByIdAndDelete(classId);
        if (!deletedClass) {
          return response.status(404).json({ message: "Class not found" });
        }
        response.status(200).json({ message: "Class deleted successfully" });
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      response.status(400).json({ message: "Invalid Class Id" });
    }
  });
  