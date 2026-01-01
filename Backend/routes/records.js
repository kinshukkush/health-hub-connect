import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/records
// @desc    Get user's medical records
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user._id }).sort({ uploadedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/records
// @desc    Create medical record
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      patientId: req.user._id,
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/records/:id
// @desc    Delete medical record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (record.patientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await record.deleteOne();
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
