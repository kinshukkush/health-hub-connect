import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['patient', 'admin'],
    default: 'patient',
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  allergies: [String],
  chronicConditions: [String],
  medications: [String],
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

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
    lowercase: true,
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
    min: 0,
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
    min: 0,
  },
  avatar: String,
  available: {
    type: Boolean,
    default: true,
  },
  nextAvailable: String,
  bio: {
    type: String,
    maxlength: 1000,
  },
  languages: [String],
  hospital: {
    type: String,
    required: true,
  },
  hospitalAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    slots: [{
      startTime: String,
      endTime: String,
      available: Boolean,
    }],
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  certifications: [String],
  awards: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  doctorName: String,
  doctorSpecialization: String,
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  reason: {
    type: String,
    required: true,
  },
  symptoms: [String],
  notes: String,
  adminNotes: String,
  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
    }],
    tests: [String],
    diagnosis: String,
    followUpDate: Date,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['lab_report', 'prescription', 'imaging', 'discharge_summary', 'vaccination', 'other'],
    required: true,
  },
  description: String,
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  doctorName: String,
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  metadata: {
    testDate: Date,
    labName: String,
    results: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Create models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
export const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', medicalRecordSchema);
