const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    location: { type: String, required: true }, // e.g., 'Ganaja', 'Lokoja'
    dateSubscribed: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);