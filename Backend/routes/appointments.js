import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments (admin) or user's appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'admin') {
      appointments = await Appointment.find({}).sort({ createdAt: -1 });
    } else {
      appointments = await Appointment.find({ patientId: req.user._id }).sort({ createdAt: -1 });
    }
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/appointments
// @desc    Create appointment
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      patientId: req.user._id,
      patientName: req.user.name,
      patientEmail: req.user.email,
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private (Admin for approval/rejection)
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Users can only cancel their own appointments
    if (req.user.role !== 'admin' && appointment.patientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = req.body.status || appointment.status;
    appointment.notes = req.body.notes || appointment.notes;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'admin' && appointment.patientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
