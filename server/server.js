require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

// Database
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reportRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

console.log("Current Directory Node is in:", __dirname);
console.log("Loaded JWT Secret from .env:", process.env.JWT_SECRET);

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use(express.static(path.join(__dirname, '../')));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'HydroFlood Kogi API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});