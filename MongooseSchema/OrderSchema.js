const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'], // You can customize based on your status options
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  orderStatus:{
    type:String,
    required:true,
    default:'pending',
    enum:['pending', 'processing', 'shipped','completed']
  },
  product:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true
  },
  notes:{
    type:String
  }
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);
;
