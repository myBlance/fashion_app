import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Alert } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product'; // ✅ Import type

// ✅ Hàm gọi API
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
    }
    // ✅ Sửa lỗi cú pháp: nhận đúng kiểu dữ liệu
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi API /api/products:', error);
    throw error;
  }
};

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
        const data = await fetchProducts();
        setProducts(data);
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
        Bán chạy trong tháng 🏆
      </Typography>
      <Typography variant="body2" mb={3} align="center">
        Những sản phẩm được yêu thích và mua nhiều nhất trong tháng qua!
      </Typography>

      <Box display="flex" alignItems="center" gap={1} justifyContent="center">
        <IconButton onClick={() => scrollByOneProduct('left')} size="large">
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={scrollRef}
          display="flex"
          sx={{
            overflowX: 'auto',
            width: containerWidth,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {bestSellingProducts.length > 0 ? (
            bestSellingProducts.map((product) => (
              <Box
                key={product.id}
                flex="0 0 auto"
                sx={{ minWidth: productWidth, pl: 1, mr: 1, mb: 2, mt: 2 }}
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

        <IconButton onClick={() => scrollByOneProduct('right')} size="large">
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BestSellers;