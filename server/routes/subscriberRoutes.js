const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// Route to add a new subscriber
router.post('/subscribe', async (req, res) => {
    try {
        const newSubscriber = new Subscriber(req.body);
        await newSubscriber.save();
        res.status(201).json({ message: 'Subscription successful!' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to subscribe.' });
    }
});

module.exports = router;