const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const User = model('User', userSchema)

module.exports = User