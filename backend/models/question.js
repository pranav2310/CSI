const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['common', 'product'], required: true },
  product: { type: String, ref: 'Product', default: null },
});
module.exports = mongoose.model('Question', questionSchema);
