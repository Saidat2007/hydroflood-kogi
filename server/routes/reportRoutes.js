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

router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Create the report using the data from the form
        const newReport = new Report({
            title: req.body.title,
            issueType: req.body.issueType,
            description: req.body.description,
            location: req.body.location,
            image: req.file ? req.file.path : "",
            userId: req.user ? req.user._id : "000000000000000000000000"
        });

        await newReport.save();
        
        // Return clean JSON - This is what the dashboard expects!
        res.status(201).json({ success: true, message: 'Report submitted successfully!' });
    } catch (err) {
        // If there's an error, return JSON instead of crashing
        res.status(400).json({ success: false, message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        console.error(error); // This prints the error in your terminal
        res.status(500).json({ message: "Server error" });
    }
});

// 2. THE POST ROUTE (For handling the form submission)
// This is the ONLY place that should send back the <script> alert snippet!
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // ... (your existing report creation logic where it sets up fields) ...
        
        const createdReport = await report.save();
        
        // 🔥 The alert script snippet belongs ONLY right here at the end of the POST route!
        res.status(201).json({message: 'Report submitted successfully!', report:createdReport});

    } catch (err) {
        res.status(400).json({ message: err.message });
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

// PATCH route to update a report's status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    
    // Validate that the incoming status is one of our allowed options
    if (!['Pending', 'Investigating', 'Resolved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status type' });
    }

    try {
        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { returnDocument: 'after' } // Returns the newly updated document
        );
        
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.status(200).json(updatedReport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to update a report's status (Admin only)
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;

    // Validate that the incoming status matches our enum exactly
    const validStatuses = ['Pending', 'Investigating', 'Resolved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ message: 'Status updated successfully', report: updatedReport });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating status', error: error.message });
    }
});
// Make sure this is at the absolute bottom of the file!
module.exports = router;
