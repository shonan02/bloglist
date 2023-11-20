const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minlength: 3
    },
    name: String,
    password: {
      type: String,
      required: true,
      minlength: 3
    },
    blogs: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog'
      }
  ],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('User', userSchema);