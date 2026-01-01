import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  patientName: String,
  patientEmail: String,
  doctorId: {
    type: String,
    required: true,
  },
  doctorName: String,
  doctorSpecialization: String,
  date: {
    type: String,
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
  notes: String,
}, {
  timestamps: true,
});

export default mongoose.model('Appointment', appointmentSchema);
