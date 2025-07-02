const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: admin.userId, role: 'admin' },
      process.env.JWT_SECRET || 'supersecret', // fallback for dev
      { expiresIn: '2h' }
    );

    res.json({ token, admin: { userId: admin.userId } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
