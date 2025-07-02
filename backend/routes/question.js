const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/auth');
const questionController = require('../controllers/questionController');

// const express = require('express');
// const router = express.Router();
const Question = require('../models/question');

router.get('/', async (req, res) => {
  const questions = await Question.find().populate('product');
  res.json(questions);
});

module.exports = router;


router.post('/', adminAuth, questionController.createQuestion);
router.get('/', questionController.getQuestions);
router.put('/:id', adminAuth, questionController.updateQuestion);

module.exports = router;
