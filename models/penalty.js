const mongoose = require('mongoose')

const penaltySchema = new mongoose.Schema({
penaltydate: {
    type: Date,
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
  gcnum: {
    type: String,
    required: true,
    unique:true
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
  default:0.00
  },
  modifiedDate: {
    type: Date,
    default: Date.now
  },
  status:{
    type: String,
    default:'Pending'
  },
  coverImage: {
    type: Buffer
    
  },
  receiptImage:{
  type:Buffer
  },
  
  coverImageType: {
    type: String
    
  },
  receiptImageType: {
    type: String
    
  }
})


penaltySchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

penaltySchema.virtual('receiptImagePath').get(function() {
  if (this.receiptImage != null && this.receiptImageType != null) {
    return `data:${this.receiptImageType};charset=utf-8;base64,${this.receiptImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Penalty', penaltySchema)