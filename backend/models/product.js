const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }
});
module.exports = mongoose.model('Product', productSchema);
