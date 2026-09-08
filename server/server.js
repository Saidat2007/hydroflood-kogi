<<<<<<< HEAD
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

=======
const path = require('path');
require('dotenv').config();
const express = require('express');
>>>>>>> 49153e9db2043274749b3d27014f75ac1a5d9698
// Database
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reportRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
<<<<<<< HEAD

console.log("Current Directory Node is in:", __dirname);
console.log("Loaded JWT Secret from .env:", process.env.JWT_SECRET);

const app = express();
app.use(cors());

=======
console.log("Current Directory Node is in:", __dirname);
console.log("Loaded JWT Secret from .env:", process.env.JWT_SECRET);
const cors = require('cors');

const app = express();
app.use(cors());
>>>>>>> 49153e9db2043274749b3d27014f75ac1a5d9698
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
<<<<<<< HEAD
app.use('/api/auth', authRoutes);
=======
app.use('/api/auth', authRoutes)
>>>>>>> 49153e9db2043274749b3d27014f75ac1a5d9698
app.use('/api/reports', reportRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use(express.static(path.join(__dirname, '../')));
<<<<<<< HEAD
app.use('/uploads', express.static('uploads'));
=======
// Add this to server.js
app.use('/uploads', express.static('/uploads'));
>>>>>>> 49153e9db2043274749b3d27014f75ac1a5d9698

app.get('/', (req, res) => {
  res.json({ message: 'HydroFlood Kogi API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 49153e9db2043274749b3d27014f75ac1a5d9698
