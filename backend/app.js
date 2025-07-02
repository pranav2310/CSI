require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const customerRoutes = require('./routes/customer');
const productRoutes = require('./routes/product');
const questionRoutes = require('./routes/question');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Enable CORS for your frontend origin only (recommended)
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}));

// Parse JSON bodies
app.use(express.json());

// Register routes
app.use('/api/admin', adminRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/product', productRoutes);
app.use('/api/feedback', feedbackRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// Optional: Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
