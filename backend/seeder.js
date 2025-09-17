const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const createAdmin = async () => {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists. Seeder script aborted.');
      process.exit();
    }

    // Check if ADMIN_EMAIL and ADMIN_PASSWORD are set in .env
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.');
        process.exit(1);
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    // Create the admin user
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
    process.exit(1);
  }
};

// The script will run this function when executed
createAdmin();