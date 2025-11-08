import React, { useState } from 'react';
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
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

// Giả lập dữ liệu đánh giá
const mockReviews = [
  {
    id: 1,
    username: 'trangthoonth',
    rating: 5,
    date: '2022-11-13 10:53',
    variant: 'Đen + Lót chuột',
    content: 'Chất lượng sản phẩm: Ổn áp, giá thành rẻ, hoạt động khá ok.\n\nTính năng nổi bật: chuột không dây, click ko phát ra âm thanh, cầm vừa tay, nhỏ, dễ mang theo khi ra ngoài, hàng tặng đẹp, mới. Rất đáng mua nha.\n\nGiao hàng nhanh, đóng gói hàng kỹ, giá rẻ còn dc tặng thêm lót chuột và pin nữa. Nói chung là chuột đẹp, nhỏ gọn nhìn cute xíu luôn á. Mình khuyên mọi người nên mua hàng nha. Chắc chắn sẽ không khiến mọi người thất vọng đâu :)) Tuy mình vẫn chưa sử dụng sản phẩm lâu nhưng nhìn cách đóng gói và các món hàng tặng được gọn gàng, an toàn và vẫn còn mới tỉnh thì mình khá là an tâm.',
    images: [
      'https://via.placeholder.com/100?text=Image+1',
      'https://via.placeholder.com/100?text=Image+2',
    ],
    likes: 19,
  },
  {
    id: 2,
    username: 'm****5',
    rating: 5,
    date: '2023-03-30 17:10',
    variant: 'Hồng + Lót chuột',
    content: 'Chất lượng sản phẩm: tốt, giao hàng nhanh, đóng gói cẩn thận. Mình rất hài lòng với sản phẩm này!',
    images: [],
    likes: 7,
  },
  {
    id: 3,
    username: 'nguyen_van_a',
    rating: 4,
    date: '2023-05-20 14:30',
    variant: 'Trắng + Không tặng kèm',
    content: 'Sản phẩm tốt, giá hợp lý. Tuy nhiên có một số điểm nhỏ chưa ưng ý.',
    images: ['https://via.placeholder.com/100?text=Video+0:06'],
    likes: 3,
  },
  {
    id: 4,
    username: 'le_thi_b',
    rating: 3,
    date: '2023-06-01 09:15',
    variant: 'Xanh + Lót chuột',
    content: '',
    images: [],
    likes: 0,
  },
];

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
          {/* Nếu là video, thêm icon play */}
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

// Component đánh giá sản phẩm
const ProductReviews: React.FC = () => {
  const theme = useTheme();

  // Trạng thái lọc
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [hasCommentFilter, setHasCommentFilter] = useState<boolean | null>(null);
  const [hasMediaFilter, setHasMediaFilter] = useState<boolean | null>(null);

  // Thống kê tổng quan
  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: mockReviews.filter(r => r.rating === star).length,
  }));

  const hasComments = mockReviews.filter(r => r.content.trim().length > 0).length;
  const hasMedia = mockReviews.filter(r => r.images.length > 0).length;

  // Lọc đánh giá theo trạng thái
  const filteredReviews = mockReviews.filter(review => {
    // Lọc theo số sao
    if (selectedStars !== null && review.rating !== selectedStars) {
      return false;
    }
    // Lọc theo có bình luận
    if (hasCommentFilter !== null && hasCommentFilter !== (review.content.trim().length > 0)) {
      return false;
    }
    // Lọc theo có hình ảnh/video
    if (hasMediaFilter !== null && hasMediaFilter !== (review.images.length > 0)) {
      return false;
    }
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
          <Card key={review.id} sx={{ mb: 2, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Avatar sx={{ bgcolor: 'grey.300' }}>
                  {review.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.username.replace(/^(.{1})(.*)(.{1})$/, '$1****$3')} {/* Ẩn một phần tên */}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Stack>

                  <Typography variant="caption" color="text.secondary" mb={1}>
                    {review.date} | Phân loại hàng: {review.variant}
                  </Typography>

                  <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {review.content || <i>Không có bình luận</i>}
                  </Typography>

                  <ReviewMedia media={review.images} />

                  <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                    <Tooltip title="Thích">
                      <IconButton size="small" sx={{ color: 'grey.600' }}>
                        <ThumbUpIcon fontSize="small" />
                        <Typography variant="caption" ml={0.5}>
                          {review.likes}
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
      {filteredReviews.length < mockReviews.length && (
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