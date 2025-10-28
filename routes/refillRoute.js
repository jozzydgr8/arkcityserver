const router = require('express').Router();
const {addRefill, getRefill, deleteRefill} = require('../controller/refillController');
const authenticator = require('../middleware/authenticator');
const Refill = require('../MongooseSchema/RefillSchema');
const mongoose = require('mongoose')

router.post('/', authenticator, addRefill);
router.get('/', authenticator, getRefill);
// router.delete('/:id', deleteRefill);

// router.put('/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Refill.collection.updateOne(
//       { _id: new mongoose.Types.ObjectId(id) },
//       { $set: { createdAt: new Date('2025-10-10T00:00:00Z') , updatedAt: new Date('2025-10-10T00:00:00Z') } }
//     );

//     res.status(200).json({ message: 'createdAt updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error updating date' });
//   }
// });


module.exports=router;