// src/components/Client/BestSellers.tsx
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Alert, Box, CircularProgress, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../../../types/Product';
import ProductCard from '../Productcard/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 5;
  const containerWidth = visibleCount * (productWidth + productMarginRight);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Lấy sản phẩm trending từ API mới
  useEffect(() => {
    const loadTrendingProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products/trending`);
        setProducts(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    loadTrendingProducts();
  }, []);

  const scrollByOneProduct = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = productWidth + productMarginRight;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
        <LocalFireDepartmentIcon sx={{ color: '#ff5722', fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold" align="center">
          Trending trong tuần
        </Typography>
        <LocalFireDepartmentIcon sx={{ color: '#ff5722', fontSize: 32 }} />
      </Box>
      <Typography variant="body2" mb={3} align="center">
        Top 10 sản phẩm được mua nhiều nhất trong 7 ngày qua!
      </Typography>

      <Box display="flex" alignItems="center" gap={1} justifyContent="center" sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <IconButton
          onClick={() => scrollByOneProduct('left')}
          size="large"
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={scrollRef}
          display="flex"
          sx={{
            overflowX: 'auto',
            width: '100%',
            maxWidth: containerWidth,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollBehavior: 'smooth',
            gap: { xs: 1, md: 3 }
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <Box
                key={product.id}
                flex="0 0 auto"
                sx={{ minWidth: productWidth, mb: 2, mt: 2 }}
              >
                <ProductCard product={product} />
              </Box>
            ))
          ) : (
            <Typography variant="body1" align="center" width="100%">
              Chưa có sản phẩm trending trong tuần này.
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={() => scrollByOneProduct('right')}
          size="large"
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BestSellers;