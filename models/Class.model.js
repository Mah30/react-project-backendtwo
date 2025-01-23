const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema ({
    name: {                      //nome da aula
        required: true, 
        type: String,
    },
    /* instructor: {
        type: Schema.Types.ObjectId, 
        ref: "Instructor",        
    }, */
    capacity: {
        required: true, //capacidade máxima de alunos
        type: Number,

    },
    schedule: { 
        type:[{ type: Date }], 
        required: true,
    },
    duration: {
        required: true,
        type: Number,
    },  
    bookings: [
        { type: Schema.Types.ObjectId, 
            ref: "Booking" },
    ],
    
});

// CREATE MODEL, it changes to plural alone 
const Class = mongoose.model('Class', ClassSchema)

// EXPORT THE MODEL
module.exports = Class;