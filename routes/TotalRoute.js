const router = require('express').Router();
const {addTotal, getTotal, updateTotal} = require('../controller/TotalController');
const authenticator = require('../middleware/authenticator');
const Total = require('../MongooseSchema/TotalUnitSchema');
const mongoose = require('mongoose')

// router.post('/',authenticator, addTotal);
router.get('/', authenticator, getTotal);
// router.put('/:id', updateTotal);


// router.put('/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Total.collection.updateOne(
//       { _id: new mongoose.Types.ObjectId(id) },
//       { $set: { createdAt: new Date('2025-10-10T00:00:00Z') , updatedAt: new Date('2025-10-10T00:00:00Z') } }
//     );

//     res.status(200).json({ message: 'createdAt updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error updating date' });
//   }
// });

module.exports = router;