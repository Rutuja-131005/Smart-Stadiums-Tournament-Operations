import mongoose from 'mongoose';

const transportRouteSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['shuttle', 'metro', 'bus', 'parking', 'rideshare', 'walking'], required: true },
    origin: { name: String, coordinates: { lat: Number, lng: Number } },
    destination: { name: String, coordinates: { lat: Number, lng: Number } },
    durationMinutes: Number,
    distanceKm: Number,
    capacity: Number,
    currentLoad: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'busy', 'full', 'delayed', 'closed'], default: 'available' },
    accessibility: {
      wheelchairAccessible: { type: Boolean, default: true },
      elevatorAvailable: { type: Boolean, default: false },
    },
    schedule: [{ departureTime: String, frequency: String }],
    trafficDelayMinutes: { type: Number, default: 0 },
    aiRecommendation: String,
  },
  { timestamps: true }
);

export default mongoose.model('TransportRoute', transportRouteSchema);
