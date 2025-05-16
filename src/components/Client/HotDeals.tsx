import React from 'react';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { products } from '../../data/products'; // import trực tiếp danh sách products

const HotDeals: React.FC = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Deal nổi bật 🔥
      </Typography>
      <Typography variant="body2" mb={3}>
        Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)',
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
