import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const GAIL_RED = '#e4002b';

export default function FeedbackReport() {
  const { auth } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // Array of product IDs
  const [filterYear, setFilterYear] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    // Fetch feedbacks and products on mount
    API.get('/feedback', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(res => setFeedbacks(res.data))
      .catch(() => setError('Failed to fetch feedbacks.'));
    API.get('/product')
      .then(res => setProducts(res.data))
      .catch(() => {});
  }, [auth.token]);

  // Filtering logic
  const filtered = feedbacks.filter(fb => {
    const matchesProduct = selectedProducts.length > 0
      ? (fb.product && selectedProducts.includes(fb.product._id))
      : true;
    const matchesYear = filterYear ? fb.year === Number(filterYear) : true;
    const matchesPhone = searchPhone
      ? (fb.customer && fb.customer.phone && fb.customer.phone.includes(searchPhone))
      : true;
    return matchesProduct && matchesYear && matchesPhone;
  });

  // Get all years from feedbacks for filter dropdown
  const years = Array.from(new Set(feedbacks.map(fb => fb.year))).sort();

  // Helper to calculate average rating for a feedback
  const getAverageRating = (answers) => {
    if (!answers || answers.length === 0) return '-';
    const sum = answers.reduce((acc, ans) => acc + (ans.rating || 0), 0);
    return (sum / answers.length).toFixed(2);
  };

  // For multi-select
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: GAIL_RED, mb: 2 }}>
        Feedback Reports
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* FILTERS */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#fffbe7' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Select
            multiple
            value={selectedProducts}
            onChange={e => setSelectedProducts(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={selected => {
              if (selected.length === 0) return 'All Products';
              return products.filter(p => selected.includes(p._id)).map(p => p.name).join(', ');
            }}
            sx={{ minWidth: 220 }}
            MenuProps={MenuProps}
          >
            <MenuItem value="">
              <em>All Products</em>
            </MenuItem>
            {products.map(p => (
              <MenuItem key={p._id} value={p._id}>
                <Checkbox checked={selectedProducts.indexOf(p._id) > -1} />
                <ListItemText primary={p.name} />
              </MenuItem>
            ))}
          </Select>
          <Select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Years</MenuItem>
            {years.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
          <TextField
            placeholder="Search by customer phone"
            value={searchPhone}
            onChange={e => setSearchPhone(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: GAIL_RED }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />
        </Box>
      </Paper>

      {/* AGGREGATE PRODUCT REPORT */}
      {selectedProducts.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f6f6f6' }}>
          <Typography variant="subtitle1" sx={{ color: GAIL_RED }}>
            Combined Report: {products.filter(p => selectedProducts.includes(p._id)).map(p => p.name).join(', ')}
          </Typography>
          <ProductAggregateReport feedbacks={filtered} />
        </Paper>
      )}

      {/* FEEDBACK TABLE */}
      <TableContainer component={Paper} sx={{ bgcolor: '#fffbe7', maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Customer Phone</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Average Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No feedbacks found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(fb => (
                <TableRow
                  key={fb._id}
                  hover
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedFeedback(fb)}
                >
                  <TableCell>{fb.customer?.name || '-'}</TableCell>
                  <TableCell>{fb.customer?.phone || '-'}</TableCell>
                  <TableCell>{fb.product?.name || '-'}</TableCell>
                  <TableCell>{fb.year}</TableCell>
                  <TableCell>
                    {getAverageRating(fb.answers)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* FEEDBACK DETAIL DIALOG */}
      <Dialog
        open={!!selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, bgcolor: '#fffbe7', p: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: GAIL_RED, color: '#fff', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          Feedback Details
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box>
              <Box sx={{ mb: 2, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: GAIL_RED, mb: 1 }}>
                  <span role="img" aria-label="customer">👤</span> Customer Name: <span style={{ color: '#222' }}>{selectedFeedback.customer?.name}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: GAIL_RED, mb: 1 }}>
                  <span role="img" aria-label="customer">👤</span> Customer Phone: <span style={{ color: '#222' }}>{selectedFeedback.customer?.phone}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: GAIL_RED, mb: 1 }}>
                  <span role="img" aria-label="product">📦</span> Product: <span style={{ color: '#222' }}>{selectedFeedback.product?.name}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: GAIL_RED, mb: 1 }}>
                  <span role="img" aria-label="calendar">📅</span> Year: <span style={{ color: '#222' }}>{selectedFeedback.year}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: GAIL_RED }}>
                  <span role="img" aria-label="star">⭐</span> Average Rating:{" "}
                  <span style={{ color: '#222' }}>
                    {getAverageRating(selectedFeedback.answers)}
                  </span>
                </Typography>
              </Box>
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f6f6f6', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: GAIL_RED }}>
                  Answers
                </Typography>
                <Table size="small">
                  <TableBody>
                    {selectedFeedback.answers.map(ans => (
                      <TableRow key={ans.question?._id || ans.question}>
                        <TableCell sx={{ fontWeight: 500, color: '#333' }}>
                          {ans.question?.text || ''}
                        </TableCell>
                        <TableCell align="right" sx={{ color: GAIL_RED, fontWeight: 700 }}>
                          {ans.rating}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: GAIL_RED, mb: 1 }}>
                  Comment
                </Typography>
                <Typography sx={{ color: '#222' }}>
                  {selectedFeedback.comment || <span style={{ color: '#888' }}>No comment provided.</span>}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#f6f6f6', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          <Button onClick={() => setSelectedFeedback(null)} sx={{ color: GAIL_RED, fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

// Helper component for aggregate report
function ProductAggregateReport({ feedbacks }) {
  // Collect all answers per question across all feedbacks
  const questionStats = {};
  feedbacks.forEach(fb => {
    fb.answers.forEach(ans => {
      const qid = ans.question?._id || ans.question;
      const qtext = ans.question?.text || '';
      if (!questionStats[qid]) questionStats[qid] = { text: qtext, ratings: [] };
      questionStats[qid].ratings.push(ans.rating);
    });
  });

  if (Object.keys(questionStats).length === 0)
    return <Typography>No feedbacks for these products.</Typography>;

  return (
    <Table size="small" sx={{ mt: 1 }}>
      <TableHead>
        <TableRow>
          <TableCell>Question</TableCell>
          <TableCell>Average Rating</TableCell>
          <TableCell>Responses</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(questionStats).map(([qid, stat]) => (
          <TableRow key={qid}>
            <TableCell>{stat.text}</TableCell>
            <TableCell>
              {(stat.ratings.reduce((a, b) => a + b, 0) / stat.ratings.length).toFixed(2)}
            </TableCell>
            <TableCell>{stat.ratings.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
