const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const subscribeSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowercase:true
    }
},{timestamps:true})

module.exports = model('subscribers',subscribeSchema)