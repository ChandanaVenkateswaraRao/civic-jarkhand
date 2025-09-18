import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'admin', 'worker'],
    default: 'citizen',
  },
  assignedCategory: {
    type: String,
    enum: [null, 'Pothole', 'Streetlight', 'Trash', 'Water Leakage', 'Other'],
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);