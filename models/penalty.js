const mongoose = require('mongoose')

const penaltySchema = new mongoose.Schema({
penaltydate: {
    type: Date,
    required: true,
    default: Date.now
  },
  vehnum: {
    type: String,
    required: true
  },
  penaltyplace: {
    type: String,
    required: true
  },
  lrnum: {
    type: String,
    required: true
  },
  partyname: {
    type: String,
    required: true
  },
  penaltyamount: {
    type: Number,
    required: true
  },
  receivedamount: {
    type: Number,
    required: true
  },
  status:{
    type: Boolean,
    required: true
  },
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  }
})

penaltySchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Penalty', penaltySchema)