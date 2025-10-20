const mongoose = require('mongoose');

const TotalSchema = new mongoose.Schema({
    currentBalance:{
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('TotalUnit', TotalSchema)