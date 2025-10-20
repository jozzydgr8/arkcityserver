const router = require('express').Router();
const {addRefill, getRefill, deleteRefill} = require('../controller/refillController');

router.post('/',addRefill);
router.get('/', getRefill);
router.delete('/:id', deleteRefill);

module.exports=router;