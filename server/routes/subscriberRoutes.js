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
router.post('/send-alert', async (req, res) => {
    try {
        console.log("Received alert request for location:", req.body.location, "with message:", req.body.message);

        const { location, message } = req.body;
        const MY_API_KEY = 'b266b947be2577a246363da935c210deb78fe69db72a38828dfb24524d4';
        console.log("FORCED API KEY LENGTH:", 'b266b947be2577a246363da935c210deb78fe69db72a38828dfb24524d4'.length);
        
        let query = {};
        if (location && location !== 'All') {
            query.location = location; 
        }

        const targetSubscribers = await Subscriber.find(query);

        if (targetSubscribers.length === 0) {
            return res.status(404).json({ message: `No subscribers found for location: ${location}` });
        }

        const gsmArray = targetSubscribers.map(sub => {
            let phone = sub.phoneNumber.trim();
            if (phone.startsWith('0')) {
                phone = '234' + phone.substring(1);
            } else if (phone.startsWith('+')) {
                phone = phone.substring(1);
            }
            return {
                msidn: phone,
                msgid: 'msg_' + Math.random().toString(36).substring(2, 10)
            };
        });

        const payload = {
            SMS: {
                auth: {
                    username: 'saidatbilqis@gmail.com',
                    apikey: 'b266b947be2577a246363da935c210deb78fe69db72a38828dfb24524d4'
                },
                message: {
                    sender: 'HydroFlood',
                    messagetext: message,
                    flash: "0"
                },
                recipients: {
                    gsm: gsmArray.map(phone => ({
                        msidn: phone.trim(),
                        msgid: 'msg_' + Math.random().toString(36).substring(2, 10)
                    }))
                }
            }
        };
        const ebulkResponse = await fetch('https://api.ebulksms.com/json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const ebulkResult = await ebulkResponse.json();
        console.log("eBulkSMS API Response:", ebulkResult);

        res.status(200).json({ 
            message: `Alert sent successfully to ${targetSubscribers.length} subscriber(s) via eBulkSMS!` 
        });

    } catch (err) {
        console.error('Alert sending error details:', err.message);
        res.status(500).json({ error: 'Failed to send alert.' });
    }
});
        
module.exports = router;