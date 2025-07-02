const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  lastFeedbackYear: Number,
  otp: String,
  otpExpiry: Date
});
module.exports = mongoose.model('Customer', customerSchema);
