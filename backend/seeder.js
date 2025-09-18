import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const createAdmin = async () => {
  await connectDB();
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log('Admin user already exists.');
      process.exit();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
    await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();