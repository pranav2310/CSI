const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// POST /api/feedback - submit feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback', error: err.message });
  }
});

// (Optional) GET /api/feedback - get all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('customer')
      .populate('product')
      .populate('answers.question');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedbacks', error: err.message });
  }
});

module.exports = router;
