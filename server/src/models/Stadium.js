import mongoose from 'mongoose';

const stadiumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    capacity: { type: Number, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    zones: [
      {
        id: String,
        name: String,
        type: { type: String, enum: ['entrance', 'concourse', 'seating', 'concession', 'restroom', 'medical', 'exit', 'parking'] },
        coordinates: { lat: Number, lng: Number },
        floor: { type: Number, default: 0 },
        wheelchairAccessible: { type: Boolean, default: true },
        capacity: Number,
      },
    ],
    amenities: [String],
    imageUrl: String,
    status: { type: String, enum: ['operational', 'maintenance', 'evacuation'], default: 'operational' },
  },
  { timestamps: true }
);

stadiumSchema.index({ location: '2dsphere' });

export default mongoose.model('Stadium', stadiumSchema);
