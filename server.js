require('dotenv').config();
const path = require('path');
const express = require('express');
// Database
const mongoose = require('mongoose');

// Safe connection function that tries to connect without crashing your app
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Fails fast if offline instead of hanging
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        // If it fails, wait 5 seconds and try again instead of crashing the server
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// If the connection drops later while users are active, it logs a warning instead of crashing
mongoose.connection.on('disconnected', () => {
    console.warn("Mongoose lost connection to MongoDB. Reconnecting...");
});

// Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reportRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
console.log("Current Directory Node is in:", __dirname);
console.log("Loaded JWT Secret from .env:", process.env.JWT_SECRET);

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
// Connect to MongoDB
connectDB();

// Middleware
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/alerts', require('./routes/alertRoutes'));
// Add this to server.js
app.use('/uploads', express.static('/uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'HydroFlood Kogi API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
