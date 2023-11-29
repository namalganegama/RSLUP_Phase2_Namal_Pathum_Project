const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
    dtime: String,
    atime: String,
    gate: String,
    assignments: String
});

const Flight = mongoose.model('Flight', userSchema);

module.exports = Flight;