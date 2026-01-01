import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['lab_report', 'prescription', 'imaging', 'other'],
    required: true,
  },
  description: String,
  fileUrl: String,
  fileName: String,
  doctorName: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('MedicalRecord', medicalRecordSchema);
