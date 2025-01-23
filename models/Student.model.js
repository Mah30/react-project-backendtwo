const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* const model = mongoose.model; */

const studentsSchema = new Schema ({

    firstName: {
        lowercase: true,   
        required: true,
        trim: true,
        type: String
    },
    lastName: {
        lowercase: true,
        required: true,
        trim: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    },

    // Credenciais e contato
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
      },
    
    
    phone: {
        required: true,
        type: Number
    },
    languages: {
        type: [String],
        enum: ["English", "Spanish", "French", "German", "Portuguese", "Dutch", "Other"],
    },
    image: {
        type: String,
        default: "https://i.imgur.com/r8bo8u7.png",
      },
      booking: [
        {
          type: Schema.Types.ObjectId, 
          ref: "Booking",
        },
      ],
      isActive: {
        type: Boolean,
        default: true,
      },
    
    },
{
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,  
  
});

// CREATE MODEL
const Student = mongoose.model('Student', studentsSchema)

// EXPORT THE MODEL
module.exports = Student;
