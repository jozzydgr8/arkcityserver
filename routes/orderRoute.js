const router = require('express').Router();
const { getOrder, verifyAndPostOrder, updateOrder} = require('../controller/orderController');
const Order = require('../MongooseSchema/OrderSchema');
const authenticator = require('../middleware/authenticator');


router.get('/',authenticator,getOrder)
router.post('/verify-payment',verifyAndPostOrder );
router.patch('/:id',authenticator, updateOrder);
module.exports= router;