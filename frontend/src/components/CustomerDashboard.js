import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import Navbar from './Navbar';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Divider,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CommentIcon from '@mui/icons-material/Comment';

const GAIL_RED = '#e4002b';
const GAIL_YELLOW = '#ffe600';

function FeedbackForm({ product, customerId, customerName }) {
  const [questions, setQuestions] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    API.get('/question')
      .then(res => {
        const relevant = res.data.filter(q =>
          q.type === 'common' ||
          (
            q.type === 'product' &&
            q.product &&
            (
              String(q.product._id) === String(product._id) ||
              String(q.product) === String(product._id) ||
              String(q.product).toLowerCase() === String(product.name).toLowerCase()
            )
          )
        );
        setQuestions(relevant);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load questions.');
        setLoading(false);
      });
  }, [product._id]);

  const handleRatingChange = (qid, value) => {
    setRatings(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    try {
      await API.post('/feedback', {
        customer: customerId,
        product: product._id,
        year: new Date().getFullYear(),
        answers: questions.map(q => ({
          question: q._id,
          rating: Number(ratings[q._id]) || 0,
        })),
        comment,
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit feedback.');
    }
  };

  if (loading) return <CircularProgress sx={{ my: 4, display: 'block', mx: 'auto' }} />;
  if (submitted)
    return (
      <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: '#f6fff0', textAlign: 'center', border: `2px solid ${GAIL_RED}` }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h6" sx={{ color: GAIL_RED, fontWeight: 700, mb: 1 }}>
          Thank you for your feedback!
        </Typography>
        <Typography variant="subtitle1">
          Feedback submitted for <b>{product.name}</b>.
        </Typography>
      </Paper>
    );

  return (
    <Paper elevation={4} sx={{
      p: 0,
      mb: 4,
      borderRadius: 4,
      overflow: 'hidden',
      border: `2px solid ${GAIL_RED}`,
      bgcolor: '#fff'
    }}>
      <Box sx={{ bgcolor: GAIL_YELLOW, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <RateReviewIcon sx={{ color: GAIL_RED, fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ color: GAIL_RED, fontWeight: 700 }}>
            {product.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#333' }}>
            Customer: {customerName || 'Guest'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={3}>
          {questions.map(q => (
            <Box key={q._id}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ mb: 1, color: GAIL_RED, fontWeight: 600 }}>
                  {q.text}
                </FormLabel>
                <RadioGroup
                  row
                  value={ratings[q._id] || ''}
                  onChange={e => handleRatingChange(q._id, e.target.value)}
                  sx={{ gap: 2 }}
                >
                  {[1, 2, 3, 4, 5].map(val => (
                    <FormControlLabel
                      key={val}
                      value={val}
                      control={
                        <Radio
                          sx={{
                            color: GAIL_RED,
                            '&.Mui-checked': { color: GAIL_RED },
                          }}
                        />
                      }
                      label={val}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          <Box>
            <TextField
              label="Additional Comments"
              value={comment}
              onChange={e => setComment(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              InputProps={{
                startAdornment: (
                  <CommentIcon sx={{ color: GAIL_RED, mr: 1 }} />
                ),
              }}
              sx={{ mt: 1 }}
            />
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: GAIL_RED,
              color: '#fff',
              fontWeight: 700,
              mt: 2,
              px: 4,
              py: 1,
              fontSize: '1.1rem',
              borderRadius: 2,
              '&:hover': { bgcolor: '#b8001f' },
            }}
            onClick={handleSubmit}
            disabled={questions.length === 0}
          >
            Submit Feedback
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default function CustomerDashboard() {
  const { auth } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    API.get(`/customer/${auth.token}`)
      .then(res => {
        setCustomer(res.data);
        const productIds = Array.isArray(res.data.products)
          ? res.data.products.map(
              pid => (typeof pid === 'object' ? pid._id : pid)
            )
          : [];
        if (productIds.length > 0) {
          Promise.all(productIds.map(pid => API.get(`/product/${pid}`)))
            .then(productResponses => {
              setProducts(productResponses.map(pr => pr.data));
              setLoading(false);
            })
            .catch(() => {
              setError('Failed to load products.');
              setLoading(false);
            });
        } else {
          setProducts([]);
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Failed to load customer info.');
        setLoading(false);
      });
  }, [auth.token]);

  return (
    <Box sx={{
      maxWidth: 700,
      mx: 'auto',
      mt: 6,
      mb: 6,
      bgcolor: '#f9f9f9',
      borderRadius: 4,
      p: { xs: 2, sm: 3 },
      boxShadow: 3,
    }}>
      <Typography variant="h4" sx={{
        color: GAIL_RED,
        mb: 4,
        textAlign: 'center',
        fontWeight: 700,
        letterSpacing: 1,
      }}>
        Customer Feedback
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 6 }} />
      ) : products.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>No products found for this customer.</Alert>
      ) : (
        products.map(product => (
          <FeedbackForm
            key={product._id}
            product={product}
            customerId={auth.token}
            customerName={customer?.name || ''}
          />
        ))
      )}
    </Box>
  );
}
