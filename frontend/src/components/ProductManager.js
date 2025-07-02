// src/components/ProductManager.js
import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import {
  Box,
  Typography,
  TextField,
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

export default function ProductManager() {
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState({ name: '', code: '' });
  const [editProd, setEditProd] = useState(null);
  const [error, setError] = useState('');

  // Fetch products on mount
  useEffect(() => {
    API.get('/product').then(res => setProducts(res.data));
  }, []);

  // Add new product
  const handleAdd = async () => {
    if (!newProd.name || !newProd.code) return setError('Both name and code are required.');
    try {
      await API.post(
        '/product',
        { name: newProd.name, code: newProd.code },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setNewProd({ name: '', code: '' });
      setError('');
      const res = await API.get('/product');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to add product.');
    }
  };

  // Edit product
  const handleEdit = async () => {
    if (!editProd.name || !editProd.code) return setError('Both name and code are required.');
    try {
      await API.put(
        `/product/${editProd._id}`,
        { name: editProd.name, code: editProd.code },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setEditProd(null);
      setError('');
      const res = await API.get('/product');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to update product.');
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/product/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const res = await API.get('/product');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: GAIL_RED, mb: 2 }}>
        Manage Products
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Add Product */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#fffbe7' }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Add New Product</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Product Name"
            value={newProd.name}
            onChange={e => setNewProd(p => ({ ...p, name: e.target.value }))}
            sx={{ flex: 2 }}
          />
          <TextField
            label="Product Code"
            value={newProd.code}
            onChange={e => setNewProd(p => ({ ...p, code: e.target.value }))}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: GAIL_RED, color: '#fff', fontWeight: 600, minWidth: 120 }}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {/* Products Table */}
      <TableContainer component={Paper} sx={{ bgcolor: '#fffbe7' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Product Code</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.code}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setEditProd(p)}><EditIcon color="primary" /></IconButton>
                  <IconButton onClick={() => handleDelete(p._id)}><DeleteIcon color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editProd} onClose={() => setEditProd(null)}>
        <DialogTitle>Edit Product</DialogTitle>
        {editProd && (
          <DialogContent sx={{ minWidth: 350 }}>
            <TextField
              label="Product Name"
              value={editProd.name}
              onChange={e => setEditProd(p => ({ ...p, name: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Product Code"
              value={editProd.code}
              onChange={e => setEditProd(p => ({ ...p, code: e.target.value }))}
              fullWidth
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setEditProd(null)}>Cancel</Button>
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
