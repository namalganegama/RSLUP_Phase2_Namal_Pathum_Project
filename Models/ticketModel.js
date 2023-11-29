const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    flightname: String,
    from: String,
    to: String,
    price: String,
    passname: String,
    class: String,
    ticket: String
});

const Ticket = mongoose.model('Ticket', userSchema);

module.exports = Ticket;