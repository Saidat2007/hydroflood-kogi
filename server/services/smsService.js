const axios = require('axios');
require('dotenv').config();

async function sendFloodAlert(phoneNumber, message) {
    try {
        const response = await axios.post('https://api.termii.com/api/sms/send', {
            to: phoneNumber,
            from: process.env.TERMII_SENDER_ID,
            sms: message,
            type: 'plain',
            channel: 'generic',
            api_key: process.env.TERMII_API_KEY,
        });
        return response.data;
    } catch (error) {
        console.error('Termii API Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { sendFloodAlert };