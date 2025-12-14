import FilterAltIcon from '@mui/icons-material/FilterAlt';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card, CardContent,
  Chip,
  Divider, IconButton,
  LinearProgress,
  Rating,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Review } from '../../../types/Review';
import { getColorLabel } from '../../../utils/colorHelper';



// Component hiển thị hình ảnh/video
const ReviewMedia = ({ media }: { media: string[] }) => {
  if (!media || media.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} mt={2} sx={{ overflowX: 'auto', pb: 1 }}>
      {media.map((url, index) => (
        <Box
          key={index}
          sx={{
            width: 100,
            height: 100,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            border: '1px solid #eee',
            cursor: 'pointer',
            '&:hover img': { transform: 'scale(1.1)' },
          }}
        >
          <img
            src={url}
            alt={`Review media ${index}`}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease',
            }}
          />
          {url.includes('Video') && (
            <Box sx={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)'
            }}>
              <Typography variant="caption" color="white" fontWeight="bold">▶</Typography>
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  );
};

// Thanh tiến trình cho từng sao
const StarBreakdown = ({ star, count, total }: { star: number, count: number, total: number }) => (
  <Box display="flex" alignItems="center" gap={1} mb={0.5} width="100%">
    <Typography variant="caption" sx={{ minWidth: 30, fontWeight: 'bold' }}>{star} sao</Typography>
    <LinearProgress
      variant="determinate"
      value={total > 0 ? (count / total) * 100 : 0}
      sx={{ flexGrow: 1, height: 8, borderRadius: 4, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#b11116' } }}
    />
    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30, textAlign: 'right' }}>{count}</Typography>
  </Box>
);

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [hasCommentFilter, setHasCommentFilter] = useState<boolean | null>(null);
  const [hasMediaFilter, setHasMediaFilter] = useState<boolean | null>(null);

  // Fetch Data
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return setLoading(false);
      try {
        setLoading(true);
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${baseURL}/api/reviews/product/${productId}`);
        const data = await response.json();
        if (data.success) setReviews(data.reviews || []);
        else throw new Error(data.message);
      } catch (err: any) {
        setError(err.message || 'Lỗi tải đánh giá');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  // Statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const starCounts = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));
  const hasComments = reviews.filter(r => r.comment.trim().length > 0).length;
  const hasMedia = reviews.filter(r => r.images.length > 0).length;

  // Filtering Logic
  const filteredReviews = reviews.filter(review => {
    if (selectedStars !== null && review.rating !== selectedStars) return false;
    if (hasCommentFilter && !(review.comment.trim().length > 0)) return false;
    if (hasMediaFilter && !(review.images.length > 0)) return false;
    return true;
  });

  if (loading) return <Box p={4}><LinearProgress sx={{ color: '#b11116' }} /></Box>;
  if (error) return <Box p={4}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>

      {/* --- Phần Tổng Quan (Dashboard) --- */}
      <Card sx={{ bgcolor: '#fffcfc', border: 'none', boxShadow: 'none', mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }} // Mobile: Cột dọc, Desktop: Hàng ngang
            alignItems="center"
            gap={{ xs: 3, md: 4 }} // Khoảng cách giữa các phần
          >

            {/* Phần 1: Điểm số trung bình */}
            <Box
              sx={{
                textAlign: 'center',
                width: '100%',
                flex: { md: 1.2 }, // Chiếm tỉ lệ nhỏ
                borderRight: { md: '1px solid #eee' }, // Viền phải trên desktop
                borderBottom: { xs: '1px solid #eee', md: 'none' }, // Viền dưới trên mobile
                pb: { xs: 2, md: 0 },
                pr: { md: 2 }
              }}
            >
              <Typography variant="h3" color="#b11116" fontWeight="bold">
                {averageRating.toFixed(1)}<span style={{ fontSize: '20px', color: '#999' }}>/5</span>
              </Typography>
              <Rating value={averageRating} readOnly precision={0.1} size="large" sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Dựa trên {totalReviews} đánh giá
              </Typography>
            </Box>

            {/* Phần 2: Thanh tỉ lệ sao */}
            <Box
              sx={{
                width: '100%',
                flex: { md: 1.8 }, // Chiếm tỉ lệ lớn nhất
                px: { md: 2 }
              }}
            >
              {starCounts.map(({ star, count }) => (
                <StarBreakdown key={star} star={star} count={count} total={totalReviews} />
              ))}
            </Box>

            {/* Phần 3: Nút lọc nhanh */}
            <Box
              sx={{
                width: '100%',
                flex: { md: 1 }, // Chiếm tỉ lệ vừa
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                pl: { md: 2 }
              }}
            >
              <Button
                variant={selectedStars === null ? "contained" : "outlined"}
                size="small"
                onClick={() => { setSelectedStars(null); setHasCommentFilter(null); setHasMediaFilter(null); }}
                sx={{ bgcolor: selectedStars === null ? '#b11116' : 'transparent', color: selectedStars === null ? '#fff' : '#b11116', borderColor: '#b11116' }}
              >
                Tất cả
              </Button>
              <Button
                variant={hasMediaFilter ? "contained" : "outlined"}
                size="small"
                onClick={() => setHasMediaFilter(prev => !prev)}
                sx={{ borderColor: '#b11116', color: hasMediaFilter ? '#fff' : '#b11116', bgcolor: hasMediaFilter ? '#b11116' : 'transparent' }}
              >
                Có Hình ảnh / Video ({hasMedia})
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>

      {/* --- Bộ lọc chi tiết (Horizontal Scroll on Mobile) --- */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', pb: 1 }}>
        <FilterAltIcon color="action" sx={{ mt: 0.5 }} />
        <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.8, mr: 1, display: { xs: 'none', sm: 'block' } }}>Lọc theo:</Typography>
        {[5, 4, 3, 2, 1].map(star => (
          <Chip
            key={star}
            icon={<StarIcon fontSize="small" />}
            label={`${star} (${starCounts.find(s => s.star === star)?.count})`}
            onClick={() => setSelectedStars(prev => prev === star ? null : star)}
            variant={selectedStars === star ? "filled" : "outlined"}
            color={selectedStars === star ? "error" : "default"}
            clickable
            sx={{ fontWeight: selectedStars === star ? 'bold' : 'normal' }}
          />
        ))}
        <Chip
          label={`Có Bình Luận (${hasComments})`}
          onClick={() => setHasCommentFilter(prev => !prev)}
          variant={hasCommentFilter ? "filled" : "outlined"}
          color={hasCommentFilter ? "error" : "default"}
          clickable
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* --- Danh sách đánh giá --- */}
      <Box>
        {filteredReviews.length > 0 ? filteredReviews.map((review) => (
          <Box key={review._id} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar sx={{ bgcolor: '#f0f0f0', color: '#666', width: 48, height: 48 }}>
                {review.userId.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box flexGrow={1} textAlign="left">
                <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '14px' }}>
                  {review.userId.username.replace(/^(.{1})(.*)(.{1})$/, '$1****$3')}
                </Typography>
                <Rating value={review.rating} readOnly size="small" sx={{ fontSize: '14px', my: 0.5, display: 'flex' }} />
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {new Date(review.createdAt).toLocaleString('vi-VN')}
                  {(review.selectedColor || review.selectedSize) && (
                    <> | Phân loại: {review.selectedColor ? getColorLabel(review.selectedColor) : ''} {review.selectedSize ? `, Size ${review.selectedSize}` : ''}</>
                  )}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1, color: '#333', lineHeight: 1.6, textAlign: 'justify' }}>
                  {review.comment}
                </Typography>

                <ReviewMedia media={review.images} />

                <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                  <Tooltip title="Hữu ích">
                    <IconButton size="small">
                      <ThumbUpIcon fontSize="small" sx={{ fontSize: '16px' }} />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary">
                    {review.likes || 0} Hữu ích
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Divider sx={{ mt: 3, borderStyle: 'dashed' }} />
          </Box>
        )) : (
          <Box textAlign="center" py={5}>
            <Typography color="text.secondary">Chưa có đánh giá nào phù hợp.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductReviews;