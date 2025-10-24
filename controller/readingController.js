const DailyReading = require('../MongooseSchema/ReadingsSchema');
const Total  = require('../MongooseSchema/TotalUnitSchema');

const getReadings = async(req, res)=>{
    
    try{
        const readings = await DailyReading.find({});
        res.status(200).json(readings)
    }catch(error){
        res.status(400).json({error:error})
    }
}

const addDailyReading = async (req,res)=>{
  const {dailyReading} = req.body;
  const today = new Date().toISOString().split('T')[0];
  const startOfDay = new Date(`${today}T00:00:00.000Z`);
  const endOfDay = new Date(`${today}T23:59:59.999Z`);

  if (typeof dailyReading !== 'number') {
  return res.status(400).json({ error: 'Invalid or missing dailyReading' });
  }

  try{
      const checkDaily = await DailyReading.findOne({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (checkDaily){
      return res.status(400).json({error:'daily reading has already been set!'})
    }
    const getCurrentTotal = await Total.findOne({});
    if(!getCurrentTotal){
      return res.status(400).json({error:'Total Balance has not been set'});
    }
    const newBalance = getCurrentTotal.currentBalance - dailyReading;

    if (newBalance < 0){
     return res.status(400).json({error:'reading has surpassed the total'})
    }

    const newTotalBalance = await Total.findOneAndUpdate({_id:getCurrentTotal._id},{
      currentBalance:newBalance
    },{ new: true })
    const dailyReading = await DailyReading.create({dailyReading:dailyReading, balance:newBalance});
    
    res.status(200).json({dailyReading:dailyReading, totalBalance:newTotalBalance})
  }catch(error){
    res.status(500).json({error:error})
  }
}
// const addOpeningReading = async (req, res) => {
//   const { openingReading } = req.body;

//   try {
//     // Get today's date range in UTC
//     const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
//     const startOfDay = new Date(`${today}T00:00:00.000Z`);
//     const endOfDay = new Date(`${today}T23:59:59.999Z`);

//     // Check if a reading already exists for today
//     const existingReading = await DailyReading.findOne({
//       createdAt: {
//         $gte: startOfDay,
//         $lte: endOfDay
//       }
//     });

//     if (existingReading) {
//       return res.status(400).json({ error: 'Opening reading already added for today' });
//     }

//     // Create new reading
//     const reading = await DailyReading.create({ openingReading });
//     res.status(200).json({ message: 'Product added successfully', reading });

//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// const updateclosingReading = async(req,res)=>{
    
//     const {dailyReading} = req.body;

//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(400).json({error:'invalid request'})
//     }
   
//     try{
//         const getReading = await DailyReading.findById(id);
//         if(!getReading){
//             return res.status(400).json({error:'Opening Reading does not exist'})
//         }
//             // Check if this reading was created today
//                 const createdAt = getReading.createdAt;
//                 const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//                 const startOfDay = new Date(`${today}T00:00:00.000Z`);
//                 const endOfDay = new Date(`${today}T23:59:59.999Z`);

//                 if (createdAt < startOfDay || createdAt > endOfDay) {
//                 return res.status(400).json({ error: 'Cannot add closing reading: this record is not from today' });
//                 }

//                 // Check if dailyReading is already set
//                 if (getReading.dailyReading != null) {
//                 // not strictly `!== null`, but also covers undefined; depends on your schema default
//                 return res.status(400).json({ error: 'Closing reading already set for today' });
//                 }
//         const reading = await DailyReading.findOneAndUpdate({_id:id},{dailyReading}, {new:true});
//         res.status(200).json({message:'closing reading added succesfully',reading});

//     }catch(error){
//         res.status(400).json({error:error.message})
//     }

// }

const deleteReading = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the reading to be deleted
    const readingToDelete = await DailyReading.findById(id);

    if (!readingToDelete) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    // Add the deleted reading back to the total balance
    const getCurrentTotal = await Total.findOne({});
    if (!getCurrentTotal) {
      return res.status(400).json({ error: 'Total balance not set' });
    }

    const restoredBalance = getCurrentTotal.currentBalance + readingToDelete.dailyReading;

    const updatedTotal = await Total.findOneAndUpdate(
      { _id: getCurrentTotal._id },
      { currentBalance: restoredBalance },
      { new: true }
    );

    // Delete the reading
    await DailyReading.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Reading deleted successfully',
      restoredReading: readingToDelete,
      updatedTotalBalance: updatedTotal
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};


module.exports = {addDailyReading,getReadings, deleteReading}