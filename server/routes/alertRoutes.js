const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
// We will build the smsService next!
const { sendFloodAlert } = require('../services/smsService');

router.post('/send', async (req, res) => {
    const { location, message } = req.body;
    try {
        const subscribers = await Subscriber.find({ location });
        for (const sub of subscribers) {
            await sendFloodAlert(sub.phoneNumber, message);
        }
        res.status(200).json({ message: 'Alerts sent successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send alerts.' });
    }
});

module.exports = router;