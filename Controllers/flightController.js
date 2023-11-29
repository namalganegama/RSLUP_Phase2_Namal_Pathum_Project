const Flight = require('./../Models/flightModel');
const CustomError = require('./../Utils/CustomError');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');

exports.create = asyncErrorHandler(async (req, res, next) => {
    const newFlight = await Flight.create(req.body);
 
     res.status(201).json({
         status: 'success',
         data: {
             flight: newFlight
         }
     });
 });

 exports.getAllFlights = asyncErrorHandler(async (req, res, next) => {
    const flights = await Flight.find();
  
    res.status(200).json({
      status: 'success',
      data: {
        flights
      }
    });
  });

  exports.getFlight = asyncErrorHandler(async (req, res, next) => {
    const flightId = req.params.Id; 
    const flight = await Flight.findById(flightId);
  
    if (!flight) {
      const error = new CustomError('Flight data not found', 404);
      return next(error);
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        flight
      }
    });
  });

  exports.updateFlight = asyncErrorHandler(async (req, res, next) => {
    const Id = req.params.Id; 
  
    const updatedFlight = await Flight.findByIdAndUpdate(Id, req.body, {
      new: true, 
      runValidators: true 
    });
  
    if (!updatedFlight) {
      const error = new CustomError('Flight not found', 404);
      return next(error);
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedFlight
      }
    });
  });

  exports.deleteFlight = asyncErrorHandler(async (req, res, next) => {
    const flightId = req.params.Id; 
  
    const deletedFlight = await Flight.findByIdAndDelete(flightId);
  
    if (!deletedFlight) {
      const error = new CustomError('Flight not found', 404);
      return next(error);
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
  