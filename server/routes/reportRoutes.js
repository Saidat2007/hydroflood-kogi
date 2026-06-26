const express = require('express');
const Report = require('../models/Report');
const protect = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Create a new flood report (public)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const allowedEnums = Report.schema.path('issueType').enumValues;
        const incomingIssue = req.body.issueType;
        
        const finalIssueType = allowedEnums.includes(incomingIssue) ? incomingIssue : allowedEnums[0];

        const report = new Report({
            title: req.body.title || finalIssueType,
            issueType: finalIssueType,
            description: req.body.description,
            location: req.body.location,
            image: req.file ? req.file.path : "",
            userId: req.user?._id || "000000000000000000000000"
        });
        const createdReport = await report.save();
        res.status(201).json(createdReport);
    } catch (err) {
        res.status(400).json({ message: err.message || 'Server error' });
    }
});

// Get all reports, populate userId with name and email
router.get('/', async (res) => {
    try {
        const reports = await Report.find().populate('userId', 'name email');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

module.exports = router;
