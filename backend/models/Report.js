import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  category: {
    type: String,
    required: true,
    enum: ['Pothole', 'Streetlight', 'Trash', 'Water Leakage', 'Other'],
  },
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Resolved'],
    default: 'Submitted',
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: String }, // Department name
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });

export default mongoose.model('Report', reportSchema);