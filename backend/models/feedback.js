const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  year: Number,
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      rating: Number
    }
  ],
  comment: String
});

module.exports = mongoose.model('Feedback', feedbackSchema);
