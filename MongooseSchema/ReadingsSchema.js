const mongoose = require('mongoose');

const readSchema = new mongoose.Schema({
 
    dailyReading:{
        type:Number,
        required:true
    },

    closingReading:{
        type:Number,
        required:true
    },
    balance:{
        type:String,
        required:true
    }
}, {timestamps:true});

module.exports = mongoose.model('readings',readSchema)