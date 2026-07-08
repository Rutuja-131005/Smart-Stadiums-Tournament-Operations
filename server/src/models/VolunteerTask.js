import mongoose from 'mongoose';

const volunteerTaskSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    location: { zone: String, coordinates: { lat: Number, lng: Number } },
    dueAt: Date,
    completedAt: Date,
    category: { type: String, enum: ['guest_services', 'wayfinding', 'medical_support', 'operations', 'security_support', 'other'] },
  },
  { timestamps: true }
);

export default mongoose.model('VolunteerTask', volunteerTaskSchema);
