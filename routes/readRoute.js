const { addDailyReading, getReadings, deleteReading} = require('../controller/readingController');
const router = require('express').Router();
const admin = require('../middleware/authenticator');

router.post('/', addDailyReading);

router.get('/', getReadings);
 router.delete('/:id', deleteReading)


module.exports =router