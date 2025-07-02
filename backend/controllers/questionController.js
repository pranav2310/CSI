const Question = require('../models/question');

exports.createQuestion = async (req, res) => {
  try {
    const { text, type, product } = req.body;
    const questionData = { text, type };

    // Only set product if type is 'product' and product is provided
    if (type === 'product' && product) {
      questionData.product = product;
    } else {
      questionData.product = null; // Explicitly set to null for 'common'
    }

    const question = new Question(questionData);
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('product');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, type, product } = req.body;
    const updateData = { text, type };

    if (type === 'product' && product) {
      updateData.product = product;
    } else {
      updateData.product = null;
    }

    const question = await Question.findByIdAndUpdate(id, updateData, { new: true });
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
