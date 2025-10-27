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

const addDailyReading = async (req, res) => {
  const { closingReading } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const startOfDay = new Date(`${today}T00:00:00.000Z`);
  const endOfDay = new Date(`${today}T23:59:59.999Z`);

  if (typeof closingReading !== 'number') {
    return res.status(400).json({ error: 'Invalid or missing closingReading' });
  }

  try {
    // Prevent duplicate daily reading
    const checkDaily = await DailyReading.findOne({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (checkDaily) {
      return res.status(400).json({ error: 'Daily reading has already been set!' });
    }

    // Get last reading
    const lastDailyReading = await DailyReading.findOne().sort({ createdAt: -1 });

    // Handle first ever reading
    let dailySold = 0;
    if (lastDailyReading) {
      if (closingReading < lastDailyReading.closingReading) {
        return res.status(400).json({ error: 'New reading must be greater than previous one' });
      }
      dailySold = closingReading - lastDailyReading.closingReading;
    } else {
      // First reading — nothing sold yet
      dailySold = closingReading;
    }

    // Get total balance
    const getCurrentTotal = await Total.findOne({});
    if (!getCurrentTotal) {
      return res.status(400).json({ error: 'Total Balance has not been set' });
    }

    // Compute new balance
    const newBalance = getCurrentTotal.currentBalance - dailySold;

    if (newBalance < 0) {
      return res.status(400).json({ error: 'Reading has surpassed the total balance' });
    }

    console.log({
  currentBalance: getCurrentTotal?.currentBalance,
  dailySold,
  closingReading,
  lastClosingReading: lastDailyReading?.closingReading
});
    // Update total
    const newTotalBalance = await Total.findOneAndUpdate(
      { _id: getCurrentTotal._id },
      { currentBalance: newBalance },
      { new: true }
    );

    // Save new daily reading
    const dailyReading = await DailyReading.create({
      closingReading,
      dailyReading: dailySold,
      balance: newBalance,
    });

    res.status(200).json({
      dailyReading,
      totalBalance: newTotalBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


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