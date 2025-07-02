// src/components/AdminDashboard.js
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import QuestionManager from './QuestionManager';
import ProductManager from './ProductManager';
import CustomerUpload from './CustomerUpload';
import FeedbackTable from './FeedbackReport';

const GAIL_YELLOW = '#ffe600';
const GAIL_RED = '#e4002b';

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: GAIL_YELLOW,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 1250,
          minHeight: Infinity,
          borderRadius: 3,
          p: 4,
          bgcolor: '#fff',
          border: `2px solid ${GAIL_RED}`,
        }}
      >
        <Typography variant="h4" align="center" sx={{ color: GAIL_RED, fontWeight: 700, mb: 3 }}>
          Admin Dashboard
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': { fontWeight: 600 },
            '& .Mui-selected': { color: GAIL_RED },
            '& .MuiTabs-indicator': { backgroundColor: GAIL_RED },
          }}
        >
          <Tab label="Questions" />
          <Tab label="Products" />
          <Tab label="Upload Customers" />
          <Tab label="Feedback Reports" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 && <QuestionManager />}
          {tab === 1 && <ProductManager />}
          {tab === 2 && <CustomerUpload />}
          {tab === 3 && <FeedbackTable />}
        </Box>
      </Paper>
    </Box>
  );
}
