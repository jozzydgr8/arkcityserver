const { addOpeningReading, updateclosingReading, getReadings} = require('../controller/readingController');
const router = require('express').Router();
const admin = require('../middleware/authenticator');

router.post('/',admin, addOpeningReading);
router.put('/:id',admin,  updateclosingReading);
router.get('/',admin, getReadings);


module.exports =router