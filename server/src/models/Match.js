import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    stage: { type: String, enum: ['group', 'round16', 'quarter', 'semi', 'third', 'final'], default: 'group' },
    group: String,
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'live', 'halftime', 'completed', 'postponed'], default: 'scheduled' },
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    weather: {
      condition: String,
      temperature: Number,
      humidity: Number,
    },
  },
  { timestamps: true }
);

matchSchema.index({ stadium: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ scheduledAt: 1 });

export default mongoose.model('Match', matchSchema);
