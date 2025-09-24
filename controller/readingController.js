const Read = require('../MongooseSchema/ReadingsSchema');
const mongoose  = require('mongoose');

const getReadings = async(req, res)=>{
    
    try{
        const readings = await Read.find({});
        res.status(200).json(readings)
    }catch(error){
        res.status(400).json({error:error})
    }
}
const addOpeningReading = async (req, res) => {
  const { openingReading } = req.body;

  try {
    // Get today's date range in UTC
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const startOfDay = new Date(`${today}T00:00:00.000Z`);
    const endOfDay = new Date(`${today}T23:59:59.999Z`);

    // Check if a reading already exists for today
    const existingReading = await Read.findOne({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingReading) {
      return res.status(400).json({ error: 'Opening reading already added for today' });
    }

    // Create new reading
    const reading = await Read.create({ openingReading });
    res.status(200).json({ message: 'Product added successfully', reading });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


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
            // Check if this reading was created today
                const createdAt = getReading.createdAt;
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const startOfDay = new Date(`${today}T00:00:00.000Z`);
                const endOfDay = new Date(`${today}T23:59:59.999Z`);

                if (createdAt < startOfDay || createdAt > endOfDay) {
                return res.status(400).json({ error: 'Cannot add closing reading: this record is not from today' });
                }

                // Check if closingReading is already set
                if (getReading.closingReading != null) {
                // not strictly `!== null`, but also covers undefined; depends on your schema default
                return res.status(400).json({ error: 'Closing reading already set for today' });
                }
        const reading = await Read.findOneAndUpdate({_id:id},{closingReading}, {new:true});
        res.status(200).json({message:'closing reading added succesfully',reading});

    }catch(error){
        res.status(400).json({error:error.message})
    }

}

module.exports = {addOpeningReading, updateclosingReading, getReadings}