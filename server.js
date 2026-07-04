const path = require('path');
require('dotenv').config();
const express = require('express');
// Database
const connectDB = require('./server/config/db');

// Routes
const authRoutes = require('./server/routes/auth');
const reportRoutes = require('./server/routes/reportRoutes');
const subscriberRoutes = require('./server/routes/subscriberRoutes');
console.log("Current Directory Node is in:", __dirname);
console.log("Loaded JWT Secret from .env:", process.env.JWT_SECRET);
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/alerts', require('./server/routes/alertRoutes'));
// Add this to server.js
app.use('/uploads', express.static('server/uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'HydroFlood Kogi API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
