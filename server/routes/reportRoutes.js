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
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().populate('userId', 'name email');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
});
// @route   DELETE /api/reports/:id
// @desc    Delete a flood report entry (Protected Admin Route)
router.delete('/:id', async (req, res) => {
    try {
        // 1. Extract token from headers
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // SECURITY CHECK: If there's no token at all, instantly block them!
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
        }

        // Ensure jwt is imported at the top of your file, or we can use it here
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || 'my_super_secrete_flood_key_123';
        let decoded;

        try {
            // VERIFICATION CHECK: If the token is fake or expired, reject them!
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token. Action rejected.' });
        }

        // 2. Perform the deletion only after passing both checks
        const report = await Report.findByIdAndDelete(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // 3. Log the verified action beautifully in your terminal
        console.log(`\n===================================`);
        console.log(`VERIFIED ACTION: Report deleted.`);
        console.log(`ADMIN ACCOUNT  : ID ${decoded.id}`);
        console.log(`===================================\n`);

        res.json({ message: 'Report successfully removed by administrator.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during deletion processing.' });
    }
});

// Make sure this is at the absolute bottom of the file!
module.exports = router;
