import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['medical', 'security', 'crowd', 'technical', 'weather', 'fire', 'evacuation', 'other'],
      required: true,
    },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    status: { type: String, enum: ['open', 'investigating', 'resolved', 'closed'], default: 'open' },
    location: { zone: String, coordinates: { lat: Number, lng: Number }, floor: Number },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    aiSummary: String,
    aiRecommendations: [String],
    resolvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Incident', incidentSchema);
