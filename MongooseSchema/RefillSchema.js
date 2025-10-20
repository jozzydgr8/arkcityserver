const mongoose = require('mongoose');

const Refill = mongoose.Schema({
    amountAdded:{
        type:Number,
        required:true
    },
    balance:{
        type:String,
        required:true
    }
}, {timestamps:true})

module.exports=mongoose.model('Refill', Refill)