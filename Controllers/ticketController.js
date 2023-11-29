const Ticket = require('../Models/ticketModel');
const CustomError = require('../Utils/CustomError');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');

exports.create = asyncErrorHandler(async (req, res, next) => {
    const newTicket = await Ticket.create(req.body);
 
     res.status(201).json({
         status: 'success',
         data: {
             ticket: newTicket
         }
     });
 });

 exports.getAllTickets = asyncErrorHandler(async (req, res, next) => {
    const tickets = await Ticket.find();
  
    res.status(200).json({
      status: 'success',
      data: {
        tickets
      }
    });
  });

  exports.getTicket = asyncErrorHandler(async (req, res, next) => {
    const ticketId = req.params.Id; 
    const ticket = await Ticket.findById(ticketId);
  
    if (!ticket) {
      const error = new CustomError('Ticket data not found', 404);
      return next(error);
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        ticket
      }
    });
  });

  exports.updateTicket = asyncErrorHandler(async (req, res, next) => {
    const Id = req.params.Id; 
  
    const updatedTicket = await Ticket.findByIdAndUpdate(Id, req.body, {
      new: true, 
      runValidators: true 
    });
  
    if (!updatedTicket) {
      const error = new CustomError('Ticket not found', 404);
      return next(error);
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        ticket: updatedTicket
      }
    });
  });

  exports.deleteTicket = asyncErrorHandler(async (req, res, next) => {
    const Id = req.params.Id; 
  
    const deletedTicket = await Ticket.findByIdAndDelete(Id);
  
    if (!deletedTicket) {
      const error = new CustomError('Ticket not found', 404);
      return next(error);
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
  