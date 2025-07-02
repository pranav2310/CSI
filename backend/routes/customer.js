const express = require('express');
const router = express.Router();
const multer = require('multer');
const customerController = require('../controllers/customerController');
const upload = multer({ dest: 'uploads/' });

router.post('/request-otp', customerController.requestOtp);
router.post('/verify-otp', customerController.verifyOtp);
router.get('/:id', customerController.getCustomerById);
router.post('/upload-csv', upload.single('file'), customerController.uploadCustomersCSV);

module.exports = router;
