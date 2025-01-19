const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentsSchema = new Schema ({

    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true //precisa ser ciptografado
    },
    phone: {
        required: true,
        type: Number
    },
    languages: {
        type: [String],
        enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"]
    },
    image: {
        type: String,
        default: "https://i.imgur.com/r8bo8u7.png"
    },
    booking:[{
        type: Schema.Types.ObjectId, 
        ref: "Booking",
    }],
    createdAt: {
        type: Date, default: Date.now
    },
  
})

// CREATE MODEL
const Student = mongoose.model('Student', studentsSchema)

// EXPORT THE MODEL
module.exports = Student