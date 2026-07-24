const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
// We will build the smsService next!
const { sendFloodAlert } = require('../services/smsService');

router.post('/send-alert', async (req, res) => {
    try {
        const { location, message } = req.body;
        console.log(`Received alert request for location: ${location} with message: ${message}`);
        
                // Change your subscriber mapping to this safe version:
        const subscribers = await Subscriber.find({});
        const gsmArray = subscribers
        .filter(sub => sub && sub.phoneNumber)
        .map(sub => sub.phoneNumber);
        const smsResult = await sendFloodAlert(gsmArray, `Alert at ${location}: ${message}`);
        res.status(200).json({ success: true, message: "Alert processed", response: smsResult });
    } catch (error) {
        console.error('Route error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});
module.exports = router;