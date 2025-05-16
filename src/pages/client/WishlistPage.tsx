import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import ProductCard from '../../components/Client/ProductCard';
import { products } from '../../data/products';
import DynamicBreadcrumbs from '../../components/Client/DynamicBreadcrumbs';

const WishlistPage: React.FC = () => {
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <Box p={4}>
      <DynamicBreadcrumbs/>

      {favoriteProducts.length === 0 ? (
        <Typography variant="body1">Bạn chưa có sản phẩm yêu thích nào.</Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',   // <600px 1 cột
            sm: 'repeat(2, 1fr)',   // >=600px 2 cột
            md: 'repeat(3, 1fr)',   // >=900px 3 cột
            lg: 'repeat(4, 1fr)',   // >=1200px 4 cột
          }}
          gap={2}
        >
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WishlistPage;
