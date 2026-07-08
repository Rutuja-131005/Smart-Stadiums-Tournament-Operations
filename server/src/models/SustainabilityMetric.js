import mongoose from 'mongoose';

const sustainabilitySchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    timestamp: { type: Date, default: Date.now },
    energy: {
      consumptionKwh: Number,
      renewablePercent: Number,
      peakDemandMw: Number,
    },
    water: {
      usageLiters: Number,
      recycledPercent: Number,
    },
    waste: {
      totalKg: Number,
      recycledKg: Number,
      compostKg: Number,
      landfillKg: Number,
    },
    carbon: {
      footprintKgCo2: Number,
      offsetKgCo2: Number,
      transportEmissionsKg: Number,
    },
    aiSuggestions: [String],
  },
  { timestamps: true }
);

export default mongoose.model('SustainabilityMetric', sustainabilitySchema);
