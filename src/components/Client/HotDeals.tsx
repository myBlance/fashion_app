import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  colors: string[];
  sold: number;
  label: string;
}

const products: Product[] = [
  {
    id: 'DOLA3900',
    title: 'Quần dài ống suông',
    imageUrl: '/assets/images/xanh1.webp',
    originalPrice: 588000,
    salePrice: 299000,
    colors: ['#FFFFFF', '#000000'],
    sold: 14,
    label: 'Khuyến mãi đặc biệt',
  },
  {
    id: '2',
    title: 'Quần dài ống rộng gập gấu',
    imageUrl: '/assets/images/xanh1.webp',
    originalPrice: 588000,
    salePrice: 299000,
    colors: ['#C2A675', '#000000'],
    sold: 20,
    label: 'Khuyến mãi đặc biệt',
  },
  {
    id: '3',
    title: 'Đầm thun tay loe cut out',
    imageUrl: '/assets/images/xanh1.webp',
    originalPrice: 588000,
    salePrice: 299000,
    colors: ['#3F51B5', '#E91E63'],
    sold: 23,
    label: 'Khuyến mãi đặc biệt',
  },
  {
    id: '4',
    title: 'Áo blazer crop ngắn tay',
    imageUrl: '/assets/images/xanh1.webp',
    originalPrice: 588000,
    salePrice: 299000,
    colors: ['#F44336', '#4CAF50', '#2196F3', '#9C27B0'],
    sold: 10,
    label: 'Khuyến mãi đặc biệt',
  },
  {
    id: '5',
    title: 'Đầm lửng cổ tim tùng xếp',
    imageUrl: '/assets/images/xanh1.webp',
    originalPrice: 588000,
    salePrice: 299000,
    colors: ['#000000', '#3F51B5'],
    sold: 18,
    label: 'Khuyến mãi đặc biệt',
  },
];


const HotDeals: React.FC = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Deal nổi bật 🔥
      </Typography>
      <Typography variant="body2" mb={3}>
        Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
      </Typography>

      {/* Dùng CSS Grid để thay thế Grid component */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)', // nhỏ nhất: 1 cột
          sm: 'repeat(2, 1fr)', // >=600px: 2 cột
          md: 'repeat(3, 1fr)', // >=900px: 3 cột
          lg: 'repeat(5, 1fr)', // >=1200px: 5 cột (2.4 ~ 5 items hàng)
        }}
        gap={2}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default HotDeals;