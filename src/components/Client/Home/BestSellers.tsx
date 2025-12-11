// src/components/Client/BestSellers.tsx
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Alert, Box, CircularProgress, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getProducts } from '../../../services/productService'; // ✅ reuse service
import { Product } from '../../../types/Product'; // ✅ Import type
import ProductCard from '../Productcard/ProductCard';

const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 5;
  const containerWidth = visibleCount * (productWidth + productMarginRight);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Lấy dữ liệu từ backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Gọi API để lấy sản phẩm (có thể cần điều chỉnh limit nếu có nhiều)
        // Gọi với limit lớn để có đủ sản phẩm để lọc
        const { data } = await getProducts(
          0, // _start
          100, // _end — giới hạn 100 sản phẩm để lọc
          'createdAt', // Sắp xếp theo ngày tạo mới nhất trước
          'DESC',
          {} // Không có filter đặc biệt, lấy tất cả
        );

        const allProducts: Product[] = Array.isArray(data) ? data : [];
        setProducts(allProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ✅ Sắp xếp theo số lượng bán (bán nhiều nhất lên đầu) và lấy 10 sản phẩm đầu tiên
  const bestSellingProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

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
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Bán chạy trong tháng
      </Typography>
      <Typography variant="body2" mb={3} align="center">
        Những sản phẩm được yêu thích và mua nhiều nhất trong tháng qua!
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
          {bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product) => (
              <Box
                key={product.id}
                flex="0 0 auto"
                sx={{ minWidth: productWidth, mb: 2, mt: 2 }}
              >
                {/* ✅ Bỏ `status` sai kiểu */}
                <ProductCard product={product} />
              </Box>
            ))
          ) : (
            <Typography variant="body1" align="center" width="100%">
              Không có sản phẩm nào.
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