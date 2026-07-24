require('dotenv').config();
const axios = require('axios');

async function sendFloodAlert(gsmArray, message) {
    try {
        const username = 'saidatbilqis@gmail.com';
        const apikey = '45c5ab0c8ed3c5fc385afac8077cfcc6ef259966e90e559303a3d655a3ebb5eb';
        const sender = 'HydroFlood';

        console.log("DEBUG - Username loaded:", username);
        console.log("DEBUG - API Key length:", apikey ? apikey.length : 0);

        if (!username || !apikey) {
            throw new Error("eBulkSMS username or API key is missing");
        }

        const recipientsList = gsmArray.map(phone => {
            let clean = phone.trim();
            if (clean.startsWith('0')) return '234' + clean.slice(1);
            if (clean.startsWith('+')) return clean.slice(1);
            return clean;
        });

        if (!sender || !message || recipientsList.length === 0) {
            throw new Error("One or more required SMS parameters are missing!");
        }

        // Construct the JSON payload structure required by eBulkSMS JSON API
        const payload = {
            SMS: {
                auth: {
                    username: username,
                    apikey: apikey
                },
                message: {
                    sender: sender,
                    messagetext: message,
                    flash: "0"
                },
                recipients: {
                    gsm: recipientsList.map(num => ({ msidn: num }))
                },
                dndsender: "0"
            }
        };

        console.log("DEBUG - Sending JSON POST request to eBulkSMS...");
        const response = await axios.post('https://api.ebulksms.com/sendsms.json', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("eBulkSMS Response:", response.data);
        return response.data;

    } catch (error) {
        console.log("=== FULL ERROR DEBUG ===");
        if (error.response) {
            console.log("Server responded with data:", error.response.data);
            console.log("Status code:", error.response.status);
        } else if (error.request) {
            console.log("No response received from eBulkSMS server:", error.request);
        } else {
            console.log("Error setting up request:", error.message);
        }
        console.log("========================");
        throw error;
    }
}

module.exports = { sendFloodAlert };