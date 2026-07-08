import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = ['fan', 'volunteer', 'staff', 'security', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ROLES, default: 'fan' },
    preferredLanguage: { type: String, default: 'en' },
    accessibility: {
      highContrast: { type: Boolean, default: false },
      screenReader: { type: Boolean, default: false },
      voiceGuidance: { type: Boolean, default: false },
      wheelchairAccess: { type: Boolean, default: false },
    },
    assignedStadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium' },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export { ROLES };
export default mongoose.model('User', userSchema);
