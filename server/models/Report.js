const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            //required: true
        },
        issueType: {
            type: String,
            enum: ['Flash Flood', 'River Overflow', 'Blocked Drainage', 'Heavy Rainfall'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            optional: true,
        },
        status: {
            type: String,
            enum: ['pending', 'investigating', 'resolved'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);