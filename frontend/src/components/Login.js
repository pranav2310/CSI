// src/components/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import API from '../api/api';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import KeyIcon from '@mui/icons-material/VpnKey';

// Import GAIL logo
import gailLogo from '../assets/gail-logo.png';

const GAIL_YELLOW = '#ffe600';
const GAIL_RED = '#e4002b';
const GAIL_BLACK = '#000000';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [tab, setTab] = useState(0);

  // Customer login
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [customerError, setCustomerError] = useState('');

  // Admin login
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async () => {
    try {
      await API.post('/customer/request-otp', { phone });
      setOtpSent(true);
      setCustomerError('');
    } catch (err) {
      setCustomerError('Could not send OTP. Please check your phone number.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await API.post('/customer/verify-otp', { phone, otp });
      login({ role: 'customer', token: res.data.customerId });
      window.location.href = '/customer';
    } catch (err) {
      setCustomerError('Invalid OTP. Please try again.');
    }
  };

  const handleAdminLogin = async () => {
    try {
      const res = await API.post('/admin/login', { userId, password });
      login({ role: 'admin', token: res.data.token });
      window.location.href = '/admin';
    } catch (err) {
      setAdminError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: GAIL_YELLOW,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: 400,
          borderRadius: 3,
          bgcolor: '#fff',
          border: `2px solid ${GAIL_RED}`,
          boxShadow: `0 4px 20px 0 ${GAIL_RED}22`
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <img
            src={gailLogo}
            alt="GAIL Logo"
            style={{ width: 90, height: 'auto', marginBottom: 8 }}
          />
          <Typography variant="h5" align="center" sx={{ fontWeight: 700, color: GAIL_RED }}>
            GAIL Customer Feedback
          </Typography>
        </Box>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: GAIL_BLACK, fontWeight: 600 },
            '& .Mui-selected': { color: GAIL_RED },
            '& .MuiTabs-indicator': { backgroundColor: GAIL_RED }
          }}
        >
          <Tab label="Customer" />
          <Tab label="Admin" />
        </Tabs>

        {tab === 0 && (
          <Box>
            {customerError && <Alert severity="error" sx={{ mb: 2 }}>{customerError}</Alert>}
            <TextField
              label="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: GAIL_RED }} />
                  </InputAdornment>
                ),
              }}
            />
            {otpSent ? (
              <>
                <TextField
                  label="OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon sx={{ color: GAIL_RED }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, bgcolor: GAIL_RED, color: '#fff', fontWeight: 600, '&:hover': { bgcolor: '#b8001f' } }}
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, bgcolor: GAIL_RED, color: '#fff', fontWeight: 600, '&:hover': { bgcolor: '#b8001f' } }}
                onClick={handleSendOtp}
                disabled={!phone}
              >
                Send OTP
              </Button>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            {adminError && <Alert severity="error" sx={{ mb: 2 }}>{adminError}</Alert>}
            <TextField
              label="Admin User ID"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: GAIL_RED }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: GAIL_RED }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(v => !v)}
                      edge="end"
                    >
                      {showPassword ? <LockIcon sx={{ color: GAIL_RED }} /> : <LockIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: GAIL_RED, color: '#fff', fontWeight: 600, '&:hover': { bgcolor: '#b8001f' } }}
              onClick={handleAdminLogin}
              disabled={!userId || !password}
            >
              Login as Admin
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
