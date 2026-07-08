import mongoose from 'mongoose';

const crowdZoneSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    zoneId: { type: String, required: true },
    zoneName: { type: String, required: true },
    density: { type: Number, min: 0, max: 100, required: true },
    capacity: { type: Number, required: true },
    currentCount: { type: Number, required: true },
    trend: { type: String, enum: ['increasing', 'stable', 'decreasing'], default: 'stable' },
    predictedDensity15min: { type: Number, min: 0, max: 100 },
    coordinates: { lat: Number, lng: Number },
    floor: { type: Number, default: 0 },
    status: { type: String, enum: ['normal', 'moderate', 'congested', 'critical'], default: 'normal' },
  },
  { timestamps: true }
);

crowdZoneSchema.index({ stadium: 1, zoneId: 1 });

export default mongoose.model('CrowdZone', crowdZoneSchema);
