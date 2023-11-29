const express = require('express');
const flightController = require('./../Controllers/flightController')

const router = express.Router();

router.route('/create').post(flightController.create);
router.route('/all').get(flightController.getAllFlights);
router.route('/:Id')
.get(flightController.getFlight)
.put(flightController.updateFlight)
.delete(flightController.deleteFlight)

module.exports = router;