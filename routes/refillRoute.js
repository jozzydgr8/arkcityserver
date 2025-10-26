const router = require('express').Router();
const {addRefill, getRefill, deleteRefill} = require('../controller/refillController');
const authenticator = require('../middleware/authenticator')

router.post('/', addRefill);
router.get('/',authenticator, getRefill);
//router.delete('/:id', deleteRefill);

module.exports=router;