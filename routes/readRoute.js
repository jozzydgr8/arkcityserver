const { addOpeningReading, updateclosingReading, getReadings} = require('../controller/readingController');
const router = require('express').Router();
const superadmin = require('../middleware/superAuthenticator');

router.post('/',superadmin, addOpeningReading);
router.put('/:id',superadmin,  updateclosingReading);
router.get('/',superadmin, getReadings);


module.exports =router