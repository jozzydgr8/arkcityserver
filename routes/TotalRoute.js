const router = require('express').Router();
const {addTotal, getTotal, updateTotal} = require('../controller/TotalController');
const authenticator = require('../middleware/authenticator')

// router.post('/',authenticator, addTotal);
router.get('/',authenticator, getTotal);
// router.put('/:id', updateTotal);
module.exports = router;