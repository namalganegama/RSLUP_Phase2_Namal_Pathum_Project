const express = require('express');
const ticketController = require('./../Controllers/ticketController')

const router = express.Router();

router.route('/create').post(ticketController.create);
router.route('/all').get(ticketController.getAllTickets);
router.route('/:Id')
.get(ticketController.getTicket)
.put(ticketController.updateTicket)
.delete(ticketController.deleteTicket)

module.exports = router;