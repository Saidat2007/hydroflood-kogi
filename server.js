const path = require('path');
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
console.log("Current Directory Node is in:", __dirname);
console.log("Loaded JWT Secret from .env:", process.env.JWT_SECRET);
const reportRoutes = require('./routes/reportRoutes');
const cors = require('cors');
const subscriberRoutes = require('./routes/subscriberRoutes');

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
app.use('/api/alerts', require('./routes/alertRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'HydroFlood Kogi API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
