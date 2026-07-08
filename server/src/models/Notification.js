import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['fan', 'volunteer', 'staff', 'security', 'admin', 'all'] },
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'alert', 'warning', 'emergency', 'recommendation'], default: 'info' },
    category: { type: String, enum: ['crowd', 'transport', 'security', 'match', 'sustainability', 'general'] },
    isRead: { type: Boolean, default: false },
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
