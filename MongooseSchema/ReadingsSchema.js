const mongoose = require('mongoose');

const readSchema = new mongoose.Schema({
    openingReading:{
        required:true,
        type:Number
    },
    closingReading:{
        type:Number
    }
}, {timestamps:true});

module.exports = mongoose.model('readings',readSchema)