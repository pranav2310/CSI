// Run this in a script or Mongo shell with access to your DB
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/question');
const Product = require('../models/product');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function migrateQuestions() {
  const products = await Product.find({});
  const nameToId = {};
  products.forEach(p => { nameToId[p.name] = p._id; });

  const questions = await Question.find({ type: 'product' });
  for (const q of questions) {
    if (typeof q.product === 'string' && nameToId[q.product]) {
      q.product = nameToId[q.product];
      await q.save();
      console.log(`Updated question ${q._id} to use ObjectId for product`);
    }
  }
  console.log('Migration complete');
  process.exit();
}

migrateQuestions();
