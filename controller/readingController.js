const Read = require('../MongooseSchema/ReadingsSchema');
const mongoose  = require('mongoose');

const getReadings = async(req, res)=>{
    try{
        const readings = await Read.find({});
        res.status(200).json({readings:readings})
    }catch(error){
        res.status(400).json({error:error})
    }
}
const addOpeningReading = async (req, res)=>{
    const {openingReading} = req.body;
    try{
        const reading = await Read.create({openingReading});
        res.status(200).json({message:'product added succesfully', reading})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const updateclosingReading = async(req,res)=>{
    const {id} = req.params;
    const {closingReading} = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:'invalid request'})
    }
   
    try{
        const getReading = await Read.findById(id);
        if(!getReading){
            return res.status(400).json({error:'Opening Reading does not exist'})
        }
        const reading = await Read.findOneAndUpdate({_id:id},{closingReading}, {new:true});
        res.status(200).json({message:'closing reading added succesfully',reading});

    }catch(error){
        res.status(400).json({error:error.message})
    }

}

module.exports = {addOpeningReading, updateclosingReading, getReadings}