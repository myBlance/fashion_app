import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Rating,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  LinearProgress,
  Alert,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Review } from '../../../types/Review';

// Component hiển thị hình ảnh/video
const ReviewMedia = ({ media }: { media: string[] }) => {
  if (!media || media.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
      {media.map((url, index) => (
        <Box
          key={index}
          sx={{
            width: 80,
            height: 80,
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            '&:hover img': { transform: 'scale(1.1)' },
            transition: 'transform 0.2s ease',
          }}
        >
          <img
            src={url}
            alt={`Review media ${index}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.2s ease',
            }}
          />
          {url.includes('Video') && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.3)',
              }}
            >
              <Typography variant="caption" color="white" fontWeight="bold">
                ▶
              </Typography>
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  );
};

// Props cho component
interface ProductReviewsProps {
  productId: string; // Truyền vào ID sản phẩm để lấy đánh giá
}

// Component đánh giá sản phẩm
const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const theme = useTheme();

  // Trạng thái dữ liệu
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái lọc
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [hasCommentFilter, setHasCommentFilter] = useState<boolean | null>(null);
  const [hasMediaFilter, setHasMediaFilter] = useState<boolean | null>(null);

  // Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId || typeof productId !== 'string' || productId.length < 1) {
        setError('productId không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${baseURL}/api/reviews/product/${productId}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Lỗi từ server (text):", errorText);
          throw new Error(`Lỗi từ server: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews || []);
        } else {
          throw new Error(data.message || 'Lỗi từ server');
        }
      } catch (err: any) {
        setError(err.message || 'Lỗi không xác định');
        console.error('Lỗi khi lấy đánh giá:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Thống kê tổng quan
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  const hasComments = reviews.filter(r => r.comment.trim().length > 0).length;
  const hasMedia = reviews.filter(r => r.images.length > 0).length;

  // Lọc đánh giá theo trạng thái
  const filteredReviews = reviews.filter(review => {
    if (selectedStars !== null && review.rating !== selectedStars) return false;
    if (hasCommentFilter !== null && hasCommentFilter !== (review.comment.trim().length > 0)) return false;
    if (hasMediaFilter !== null && hasMediaFilter !== (review.images.length > 0)) return false;
    return true;
  });

  // Hàm xử lý click chip số sao
  const handleStarFilterClick = (star: number | null) => {
    setSelectedStars(prev => prev === star ? null : star);
  };

  // Hàm xử lý click chip có bình luận
  const handleCommentFilterClick = () => {
    setHasCommentFilter(prev => (prev === true ? null : true));
  };

  // Hàm xử lý click chip có hình ảnh/video
  const handleMediaFilterClick = () => {
    setHasMediaFilter(prev => (prev === true ? null : true));
  };

  // Hàm reset tất cả bộ lọc
  const resetFilters = () => {
    setSelectedStars(null);
    setHasCommentFilter(null);
    setHasMediaFilter(null);
  };

  const isAnyFilterActive = selectedStars !== null || hasCommentFilter !== null || hasMediaFilter !== null;

  if (loading) {
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        ĐÁNH GIÁ SẢN PHẨM
      </Typography>

      {/* Tổng quan đánh giá */}
      <Box
        sx={{
          p: 2,
          bgcolor: '#fff8f0',
          borderRadius: 2,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Typography variant="h4" color="error" fontWeight="bold">
            {averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body1">trên 5</Typography>
          <Rating value={averageRating} readOnly precision={0.1} size="large" />
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1} mb={1}>
          <Chip
            label="Tất Cả"
            variant={selectedStars === null && !isAnyFilterActive ? "filled" : "outlined"}
            color="primary"
            onClick={resetFilters}
            sx={{ fontWeight: 'bold' }}
          />
          {starCounts.map(({ star, count }) => (
            <Chip
              key={star}
              label={`${star} Sao (${count})`}
              variant={selectedStars === star ? "filled" : "outlined"}
              onClick={() => handleStarFilterClick(star)}
              sx={{ fontWeight: 'bold' }}
            />
          ))}
        </Stack>

        <Stack direction="row" gap={1}>
          <Chip
            label={`Có Bình Luận (${hasComments})`}
            variant={hasCommentFilter === true ? "filled" : "outlined"}
            onClick={handleCommentFilterClick}
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            label={`Có Hình Ảnh / Video (${hasMedia})`}
            variant={hasMediaFilter === true ? "filled" : "outlined"}
            onClick={handleMediaFilterClick}
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>
      </Box>

      {/* Danh sách đánh giá */}
      {filteredReviews.length > 0 ? (
        filteredReviews.map((review) => (
          <Card key={review._id} sx={{ mb: 2, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Avatar sx={{ bgcolor: 'grey.300' }}>
                  {review.userId.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.userId.username.replace(/^(.{1})(.*)(.{1})$/, '$1****$3')}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Stack>

                  <Typography variant="caption" color="text.secondary" mb={1}>
                    {new Date(review.createdAt).toLocaleString('vi-VN')} | Phân loại hàng: {review.productId}
                  </Typography>

                  <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {review.comment || <i>Không có bình luận</i>}
                  </Typography>

                  <ReviewMedia media={review.images} />

                  <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                    <Tooltip title="Thích">
                      <IconButton size="small" sx={{ color: 'grey.600' }}>
                        <ThumbUpIcon fontSize="small" />
                        <Typography variant="caption" ml={0.5}>
                          {review.likes || 0}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
            <Divider />
          </Card>
        ))
      ) : (
        <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 4 }}>
          Không có đánh giá nào phù hợp với bộ lọc hiện tại.
        </Typography>
      )}

      {/* Xem thêm nếu cần */}
      {filteredReviews.length < reviews.length && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            component="button"
            onClick={() => console.log('Load more reviews')}
            sx={{
              color: theme.palette.primary.main,
              border: 'none',
              background: 'transparent',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Xem thêm đánh giá
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductReviews;