const router = require('express').Router();
const {addTotal, getTotal, updateTotal} = require('../controller/TotalController');

router.post('/', addTotal);
router.get('/', getTotal);
router.put('/:id', updateTotal);
module.exports = router;