const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema ({
    student: {
        required: true,
        type: Schema.Types.ObjectId, 
        ref: "User", 
    },
    class: {
        required: true,
        type: Schema.Types.ObjectId, 
        ref: "Class", 
    },
    date: {
        required: true, //data e hora da reserva
        type: Date,

    },
    status: {
        required: true,
        type: String,
        default: 'confirmed'

    },

})

// CREATE MODEL, it changes to plural alone 
const Booking = mongoose.model('Booking', BookingSchema)

// EXPORT THE MODEL
module.exports = Booking;