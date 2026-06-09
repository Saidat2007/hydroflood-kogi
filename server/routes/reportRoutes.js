const express = require('express');
const Report = require('../models/Report');
const protect = require('../middleware/auth');

const router = express.Router();

// Create a new flood report (protected)
router.post('/', protect, async (req, res) => {
    try {
        const { issueType, description, location, image } = req.body;
        const report = new Report({
            issueType,
            description,
            location,
            image,
            userId: req.user,
        });
        const createdReport = await report.save();
        res.status(201).json(createdReport);
    } catch (err) {
        res.status(400).json({ message: err.message || 'Server error' });
    }
});

// Get all reports, populate userId with name and email
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().populate('userId', 'name email');
        res.status(200).json(reports);
    } catch (error)
    {
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

module.exports = protect; // This export the function directly