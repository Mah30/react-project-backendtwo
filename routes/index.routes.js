const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
    res.json('All good in here')
});

const bookingsRoutes = require('./bookings.routes')
router.use('/bookings', bookingsRoutes)

const classesRoutes = require('./classes.routes');
router.use('/classes', classesRoutes )


const studentsRoutes = require('./students.routes');
router.use('/students', studentsRoutes);


 

module.exports = router;