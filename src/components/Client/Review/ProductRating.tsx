import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Product {
  _id?: string;
  id?: string;
  code?: string;
  name: string;
  image?: string;
  price: number;
}

interface ProductInOrder {
  product: Product | null;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  productId: string; // ✅ Mã sản phẩm (string), ví dụ: "DOLA41"
}

interface ProductRatingProps {
  item: ProductInOrder;
  orderId: string;
  productId: string;
  onReviewSubmitted?: () => void; // callback để refresh review
}

export const ProductRating: React.FC<ProductRatingProps> = ({ item, orderId, productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = item.product;
  // ✅ Lấy productId từ item.productId (mã sản phẩm)

  if (!product) {
    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography color="error">Sản phẩm không tồn tại hoặc đã bị xóa.</Typography>
        </CardContent>
      </Card>
    );
  }

  // Kiểm tra đã đánh giá
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
        console.error('Lỗi khi kiểm tra đánh giá:', err?.response?.data || err.message);
      }
    };

    checkIfReviewed();
    return () => { isMounted = false; };
  }, [orderId, productId]);

  // Chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  // Xóa ảnh
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Gửi đánh giá
  const handleSubmit = async () => {
    if (rating === null) {
      setError('Vui lòng chọn số sao đánh giá.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('productId', productId); // ✅ Gửi mã sản phẩm
    formData.append('rating', rating.toString());
    formData.append('comment', comment);

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
        if (onReviewSubmitted) onReviewSubmitted(); // refresh review
      }
    } catch (err: any) {
      console.error('Lỗi khi gửi đánh giá:', err?.response?.data || err.message);
      setError(err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          {product.image && (
            <img src={product.image} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
          )}
          <div>
            <Typography variant="subtitle2">{product.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Giá: {product.price?.toLocaleString()}₫
            </Typography>
          </div>
        </Box>

        {submitted || alreadyReviewed ? (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Chip label="✅ Đã đánh giá sản phẩm" color="success" variant="outlined" sx={{ fontWeight: 'bold' }} />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Cảm ơn bạn đã đánh giá sản phẩm này!
            </Typography>
          </Box>
        ) : (
          <>
            <Rating value={rating} onChange={(_, val) => setRating(val)} size="large" sx={{ mt: 1 }} />
            <TextField
              label="Viết đánh giá (tùy chọn)"
              multiline
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              fullWidth
              margin="dense"
              disabled={loading}
            />

            <Box sx={{ mt: 2 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id={`upload-images-${productId}`} // ✅ Dùng mã sản phẩm
              />
              <label htmlFor={`upload-images-${productId}`}>
                <Button variant="outlined" component="span" startIcon={<AddPhotoAlternateIcon />} disabled={loading} sx={{ mb: 1 }}>
                  Thêm ảnh
                </Button>
              </label>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative', width: 80, height: 80 }}>
                    <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: -5, right: -5, backgroundColor: 'error.main', color: 'white', '&:hover': { backgroundColor: 'error.dark' } }}
                      onClick={() => removeImage(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} sx={{ mt: 2 }}>
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>

            {error && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{error}</Typography>}
          </>
        )}
      </CardContent>
    </Card>
  );
};