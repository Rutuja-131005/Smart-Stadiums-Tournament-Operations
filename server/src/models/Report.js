import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    type: { type: String, enum: ['match_day', 'incident', 'operational', 'executive', 'security'], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    generatedBy: { type: String, enum: ['ai', 'user'], default: 'ai' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metrics: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
