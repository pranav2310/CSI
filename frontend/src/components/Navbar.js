import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const GAIL_RED = '#e4002b';

export default function Navbar({ customerName, productName }) {
  return (
    <AppBar position="static" sx={{ bgcolor: GAIL_RED }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Customer: {customerName || 'Guest'}
        </Typography>
        <Box>
          <Typography variant="subtitle1">
            Product: {productName || 'N/A'}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
