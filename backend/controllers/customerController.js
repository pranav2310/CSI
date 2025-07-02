const Customer = require('../models/customer');
const Product = require('../models/product');
const csv = require('csv-parser');
const fs = require('fs');
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// Helper to format phone number (assumes Indian numbers if not international)
function formatPhone(phone) {
  return phone.startsWith('+') ? phone : `+91${phone}`;
}

// --- OTP: Request via Twilio Verify ---
exports.requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ message: 'Phone number not found' });

    await client.verify.v2.services(VERIFY_SERVICE_SID)
      .verifications
      .create({ to: formatPhone(phone), channel: 'sms' });

    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('Twilio Verify error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// --- OTP: Verify via Twilio Verify ---
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ message: 'Phone number not found' });

    const verificationCheck = await client.verify.v2.services(VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: formatPhone(phone), code: otp });

    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified, login successful', customerId: customer._id });
  } catch (err) {
    console.error('Twilio Verify error:', err.message);
    res.status(500).json({ message: 'Failed to verify OTP', error: err.message });
  }
};

// --- Get customer by ID (with products) ---
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid customer ID format' });
    }
    const customer = await Customer.findById(id).populate('products');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// --- CSV upload (product name mapping) ---
exports.uploadCustomersCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const results = [];
  let filePath = req.file.path;

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    let count = 0;
    for (const item of results) {
      if (!item.phone) continue;

      // Parse product names
      let productNames = [];
      if (item.products) {
        productNames = item.products
          .split(/[,;]/)
          .map(p => p.trim())
          .filter(Boolean);
      }

      // Get product IDs
      let productIds = [];
      if (productNames.length) {
        const foundProducts = await Product.find({ name: { $in: productNames } });
        productIds = foundProducts.map(p => p._id);
      }

      // Upsert customer
      let customer = await Customer.findOne({ phone: item.phone });
      if (customer) {
        customer.name = item.name || customer.name;
        customer.products = productIds;
      } else {
        customer = new Customer({
          phone: item.phone,
          name: item.name || '',
          products: productIds
        });
      }
      await customer.save();
      count++;
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Customers uploaded successfully', count });
  } catch (err) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: 'Error processing CSV', error: err.message });
  }
};
