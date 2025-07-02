// src/components/CustomerUpload.js
import React, { useRef, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const GAIL_RED = '#e4002b';

export default function CustomerUpload() {
  const { auth } = useContext(AuthContext);
  const fileInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async () => {
    setError('');
    setResult('');
    const file = fileInput.current.files[0];
    if (!file) {
      setError('Please select a CSV file to upload.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await API.post('/customer/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setResult(`Upload successful! ${res.data.count || ''} customers processed.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Upload failed. Please ensure the CSV format is correct.'
      );
    }
    setUploading(false);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: GAIL_RED, mb: 2 }}>
        Upload Customers (CSV)
      </Typography>
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#fffbe7' }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Select and upload a CSV file containing customer data.
        </Typography>
        <input
          type="file"
          ref={fileInput}
          accept=".csv"
          style={{ display: 'none' }}
          onClick={e => (e.target.value = null)} // allow re-uploading same file
        />
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          sx={{
            bgcolor: GAIL_RED,
            color: '#fff',
            fontWeight: 600,
            mt: 1,
            mb: 1,
            '&:hover': { bgcolor: '#b8001f' },
          }}
          onClick={() => fileInput.current.click()}
          disabled={uploading}
        >
          Choose CSV File
        </Button>
        {fileInput.current && fileInput.current.files[0] && (
          <Typography sx={{ ml: 2, display: 'inline' }}>
            {fileInput.current.files[0].name}
          </Typography>
        )}
        <br />
        <Button
          variant="contained"
          sx={{
            bgcolor: GAIL_RED,
            color: '#fff',
            fontWeight: 600,
            mt: 2,
            '&:hover': { bgcolor: '#b8001f' },
          }}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
        </Button>
        {result && <Alert severity="success" sx={{ mt: 2 }}>{result}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
      <Typography variant="body2" color="text.secondary">
        <b>CSV Format:</b> The file should have headers like <code>phone,name</code>.<br />
        Example:
        <pre>
phone,name
9876543210,John Doe
9123456789,Jane Smith
        </pre>
      </Typography>
    </Box>
  );
}
