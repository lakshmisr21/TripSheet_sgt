const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    unique:true,
    required:true
    
  },
  password: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('User', userSchema)