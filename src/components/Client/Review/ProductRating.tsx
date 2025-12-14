import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import RateReviewIcon from '@mui/icons-material/RateReview';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { ProductInOrder } from '../../../types/Order';

interface ProductRatingProps {
  item: ProductInOrder;
  orderId: string;
  productId: string;
  onReviewSubmitted?: () => void;
}

// Helper for Image URL (Aggressive Normalization)
const getProductImageUrl = (raw: any) => {
  if (!raw) return '/no-image.png';

  let url = raw;

  // 1. Handle Object
  if (typeof url === 'object') {
    url = url.path || url.url || '';
  }

  // 2. Handle Array (take first)
  if (Array.isArray(url)) {
    url = url.length > 0 ? url[0] : '';
  }

  if (typeof url !== 'string' || !url) return '/no-image.png';

  // 3. Check for absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 4. Normalize slashes
  url = url.replace(/\\/g, '/');

  // 5. Remove leading slashes and 'uploads/' prefix
  url = url.replace(/^(\/|uploads\/)+/, '');

  // 6. Construct full URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  return `${baseUrl}/uploads/${url}`;
};

export const ProductRating: React.FC<ProductRatingProps> = ({ item, orderId, productId, onReviewSubmitted }) => {
  const [open, setOpen] = useState(false); // Modal state
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = item.product;

  useEffect(() => {
    let isMounted = true;
    const checkIfReviewed = async () => {
      if (!orderId || !productId) return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/reviews/check`,
          {
            params: { orderId, productId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (isMounted) {
          setAlreadyReviewed(response.data.alreadyReviewed);
          setSubmitted(response.data.alreadyReviewed);
        }
      } catch (err: any) {
        console.error('Lỗi khi kiểm tra đánh giá:', err);
      }
    };
    checkIfReviewed();
    return () => { isMounted = false; };
  }, [orderId, productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!rating) {
      setError('Vui lòng chọn số sao đánh giá.');
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('productId', productId);
    formData.append('rating', rating.toString());
    formData.append('comment', comment);
    if (item.selectedColor) formData.append('selectedColor', item.selectedColor);
    if (item.selectedSize) formData.append('selectedSize', item.selectedSize);
    images.forEach(img => formData.append('images', img));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.success) {
        setSubmitted(true);
        setAlreadyReviewed(true);
        setOpen(false); // Close modal
        if (onReviewSubmitted) onReviewSubmitted();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi gửi đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  // Render Inline Status (Already Reviewed) or Button
  if (submitted || alreadyReviewed) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
        <Rating value={5} readOnly size="small" />
        <Typography variant="caption" color="success.main" fontWeight="bold">Đã đánh giá</Typography>
      </Box>
    )
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<RateReviewIcon />}
        onClick={() => setOpen(true)}
        sx={{
          textTransform: 'none',
          borderRadius: 20,
          whiteSpace: 'nowrap',
          fontSize: '0.8rem',
          borderColor: '#ddd',
          color: '#666',
          '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.04)' }
        }}
      >
        Viết đánh giá
      </Button>

      {/* Review Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
          Đánh giá sản phẩm
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {product && (
            <Stack direction="row" spacing={2} mb={3} alignItems="center">
              <img
                src={getProductImageUrl(product.thumbnail || product.image)}
                alt={product.name}
                style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">Vui lòng chia sẻ trải nghiệm của bạn</Typography>
              </Box>
            </Stack>
          )}

          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Typography component="legend" sx={{ mb: 1 }}>Bạn thấy sản phẩm thế nào?</Typography>
            <Rating
              name="product-rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
              sx={{ fontSize: '3rem' }}
            />
          </Box>

          <TextField
            label="Chia sẻ cảm nhận của bạn (Tùy chọn)"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Chất lượng sản phẩm tuyệt vời..."
            sx={{ mb: 3 }}
          />

          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id={`raised-button-file-${productId}`}
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor={`raised-button-file-${productId}`}>
              <Button variant="outlined" component="span" startIcon={<AddPhotoAlternateIcon />}>
                Thêm ảnh thực tế
              </Button>
            </label>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
              {imagePreviews.map((preview, index) => (
                <Box key={index} sx={{ position: 'relative', width: 70, height: 70 }}>
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: '#fff', '&:hover': { bgcolor: 'error.dark' }, p: 0.5 }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          {error && (
            <Box mt={2} bgcolor="#ffebee" p={1} borderRadius={1} color="error.main">
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setOpen(false)} color="inherit">Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ px: 4 }}>
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};