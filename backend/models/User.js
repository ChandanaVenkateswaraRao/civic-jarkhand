import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: {
type: String,
enum: ['citizen', 'admin', 'worker'], // Add 'worker' role
default: 'citizen',
},
// New field for workers to define their specialty
assignedCategory: {
type: String,
enum: [null, 'Pothole', 'Streetlight', 'Trash', 'Water Leakage', 'Other'],
default: null,
},
}, { timestamps: true });

export default mongoose.model('User', UserSchema);