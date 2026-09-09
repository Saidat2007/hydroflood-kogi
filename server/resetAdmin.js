const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const salt = await bcrypt.genSalt(10);
        const newPassword = 'password123'; // Change this to your preferred password
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const User = require('./models/User'); // Ensure path matches your User model file
        const updatedUser = await User.findOneAndUpdate(
            { email: 'saidatbilqis@gmail.com' },
            { password: hashedPassword },
            { new: true }
        );
        
        if (!updatedUser) {
            console.log('User with email saidatbilqis@gmail.com was not found.');
        } else {
            console.log(`Success! Password for ${updatedUser.email} was reset to: ${newPassword}`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error.message);
        process.exit(1);
    }
};

resetPassword();