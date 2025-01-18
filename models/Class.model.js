const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema ({
    name: {                      //nome da aula
        required: true, 
        type: String,
    },
    instructor: {
        type: Schema.Types.ObjectId, 
        ref: "Instructor",        // perguntar se tenho que criar um model de instrutor      
    },
    capacity: {
        required: true, //capacidade máxima de alunos
        type: Number,

    },
    schedule: {
        type: [Data],   //Datas e horários disponíveis
    },
    duration: {
        required: true,
        type: Number,
    }, 
    bookings:[
        { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }
    ]

})

// CREATE MODEL, it changes to plural alone 
const Class = mongoose.model('Class', ClassSchema)

// EXPORT THE MODEL
module.exports = Class;