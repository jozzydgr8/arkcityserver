const { addOpeningReading, updateclosingReading, getReadings } = require('../controller/readingController');
const router = require('express').Router();

router.post('/', addOpeningReading);
router.put('/:id', updateclosingReading);
router.get('/',getReadings)

module.exports =router