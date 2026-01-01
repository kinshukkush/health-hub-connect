import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  avatar: String,
  available: {
    type: Boolean,
    default: true,
  },
  nextAvailable: String,
  bio: String,
  languages: [String],
  hospital: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Doctor', doctorSchema);
