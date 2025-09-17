import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String }, // URL to the uploaded image
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
  assignedTo: { type: String }, // Simplified: Department name
  createdAt: { type: Date, default: Date.now },
});

ReportSchema.index({ location: '2dsphere' });

// OLD LINE: module.exports = mongoose.model('Report', ReportSchema);
// NEW LINE vvv
export default mongoose.model('Report', ReportSchema);