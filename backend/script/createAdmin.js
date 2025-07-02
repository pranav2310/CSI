// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
require('dotenv').config({ path: '../.env' });


const createAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const userId = 'admin';
  const password = 'admin';
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = new Admin({ userId, passwordHash });
  await admin.save();
  console.log('Admin created');
  mongoose.disconnect();
};
createAdmin();
