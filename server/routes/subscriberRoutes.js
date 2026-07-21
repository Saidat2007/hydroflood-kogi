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

// Route to view all subscribers
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.status(200).json(subscribers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subscribers.' });
    }
});
// Route to send targeted location alerts
router.post('/send-alert', async (req, res) => {
    try {
        console.log("Received alert request for location:", req.body.location, "with message:", req.body.message);
        const { location, message } = req.body;

        let query = {};
        if (location && location !== 'All') {
            query.location = location; // Filter by location if specified
        }

        // Find matching subscribers in MongoDB
        const targetSubscribers = await Subscriber.find(query);

        // Extract phone numbers
        const phoneNumbers = targetSubscribers.map(sub => sub.phoneNumber);

        // TODO: Pass 'phoneNumbers' and 'message' to your SMS gateway provider here

        res.status(200).json({ 
            success: true, 
            count: phoneNumbers.length,
            message: `Alert sent successfully to ${phoneNumbers.length} subscribers in ${location}.` 
        });

    } catch (err) {
        console.error('Alert Error:', err);
        res.status(500).json({ error: 'Failed to send alert.' });
    }
});
module.exports = router;