const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    issueType: {
        type: String,
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
        default: ""
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Investigating', 'Resolved'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);