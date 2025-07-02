// src/components/QuestionManager.js
import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const GAIL_RED = '#e4002b';

export default function QuestionManager() {
  const { auth } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [newQ, setNewQ] = useState({ text: '', type: 'common', product: '' });
  const [editQ, setEditQ] = useState(null);
  const [error, setError] = useState('');

  // Fetch questions and products on mount
  useEffect(() => {
    API.get('/question').then(res => setQuestions(res.data));
    API.get('/product').then(res => setProducts(res.data));
  }, []);

  // Add new question
  const handleAdd = async () => {
    if (!newQ.text) return setError('Question text is required.');
    try {
      await API.post(
        '/question',
        {
          text: newQ.text,
          type: newQ.type,
          product: newQ.type === 'product' ? newQ.product : undefined,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setNewQ({ text: '', type: 'common', product: '' });
      setError('');
      const res = await API.get('/question');
      setQuestions(res.data);
    } catch (err) {
      setError('Failed to add question.');
    }
  };

  // Edit question
  const handleEdit = async () => {
    if (!editQ.text) return setError('Question text is required.');
    try {
      await API.put(
        `/question/${editQ._id}`,
        {
          text: editQ.text,
          type: editQ.type,
          product: editQ.type === 'product' ? editQ.product : undefined,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setEditQ(null);
      setError('');
      const res = await API.get('/question');
      setQuestions(res.data);
    } catch (err) {
      setError('Failed to update question.');
    }
  };

  // Delete question
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await API.delete(`/question/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const res = await API.get('/question');
      setQuestions(res.data);
    } catch (err) {
      setError('Failed to delete question.');
    }
  };
  return (
    <Box>
      <Typography variant="h6" sx={{ color: GAIL_RED, mb: 2 }}>
        Manage Questions
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Add Question */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#fffbe7' }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Add New Question</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Question"
            value={newQ.text}
            onChange={e => setNewQ(q => ({ ...q, text: e.target.value }))}
            sx={{ flex: 2 }}
          />
          <Select
            value={newQ.type}
            onChange={e => setNewQ(q => ({ ...q, type: e.target.value, product: '' }))}
            sx={{ flex: 1, minWidth: 120 }}
          >
            <MenuItem value="common">Common</MenuItem>
            <MenuItem value="product">Product Specific</MenuItem>
          </Select>
          {newQ.type === 'product' && (
            <Select
              value={newQ.product}
              onChange={e => setNewQ(q => ({ ...q, product: e.target.value }))}
              sx={{ flex: 1, minWidth: 120 }}
              displayEmpty
            >
              <MenuItem value="">Select Product</MenuItem>
              {products.map(p => (
                <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
              ))}
            </Select>
          )}
          <Button
            variant="contained"
            sx={{ bgcolor: GAIL_RED, color: '#fff', fontWeight: 600, minWidth: 120 }}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {/* Questions Table */}
      <TableContainer component={Paper} sx={{ bgcolor: '#fffbe7' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {questions.map(q => (
    <TableRow key={q._id}>
      <TableCell>{q.text}</TableCell>
      <TableCell>
        {q.type === 'common' ? 'Common' : 'Product Specific'}
      </TableCell>
      <TableCell>
        {q.type === 'product' && q.product && q.product.name ? q.product.name : '-'}
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={() => setEditQ(q)}><EditIcon color="primary" /></IconButton>
        <IconButton onClick={() => handleDelete(q._id)}><DeleteIcon color="error" /></IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editQ} onClose={() => setEditQ(null)}>
        <DialogTitle>Edit Question</DialogTitle>
        {editQ && (
          <DialogContent sx={{ minWidth: 350 }}>
            <TextField
              label="Question"
              value={editQ.text}
              onChange={e => setEditQ(q => ({ ...q, text: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Select
              value={editQ.type}
              onChange={e => setEditQ(q => ({ ...q, type: e.target.value, product: '' }))}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="common">Common</MenuItem>
              <MenuItem value="product">Product Specific</MenuItem>
            </Select>
            {editQ.type === 'product' && (
              <Select
                value={editQ.product || ''}
                onChange={e => setEditQ(q => ({ ...q, product: e.target.value }))}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">Select Product</MenuItem>
                {products.map(p => (
                  <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                ))}
              </Select>
            )}
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setEditQ(null)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: GAIL_RED, color: '#fff', fontWeight: 600 }}
            onClick={handleEdit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
