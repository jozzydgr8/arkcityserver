const { addDailyReading, getReadings, deleteReading} = require('../controller/readingController');
const mongoose = require('mongoose');
const router = require('express').Router();
const admin = require('../middleware/authenticator');
const Read = require('../MongooseSchema/ReadingsSchema')
const authenticator = require('../middleware/authenticator')
router.post('/', authenticator, addDailyReading);

router.get('/', authenticator,getReadings);
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Read.collection.updateOne(
//       { _id: new mongoose.Types.ObjectId(id) },
//       { $set: { createdAt: new Date('2025-10-27T00:00:00Z') , updatedAt: new Date('2025-10-27T00:00:00Z') } }
//     );

//     res.status(200).json({ message: 'createdAt updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error updating date' });
//   }
// });


 router.delete('/:id', deleteReading)


module.exports =router