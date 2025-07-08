const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema ({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    imagePath:{
        type: String,
        required:true
    },
    image_id:{
        type: String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:['accessories','refill','cylinders']
    }
    // size:{
    //     type:Number
    // }
}, {timestamps:true})

module.exports=mongoose.model('products',ProductSchema)