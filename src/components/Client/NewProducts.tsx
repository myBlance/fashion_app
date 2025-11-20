// src/components/Client/NewProducts.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Alert } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product'; // ✅ Import type
import { getProducts } from '../../services/productService'; // ✅ reuse service

const NewProducts: React.FC = () => {
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
        // Gọi API để lấy sản phẩm
        // Sắp xếp theo createdAt DESC trực tiếp từ backend để lấy sản phẩm mới nhất
        const { data } = await getProducts(
          0, // _start
          10, // _end — giới hạn 10 sản phẩm mới nhất ngay từ đầu
          'createdAt', // Sắp xếp theo ngày tạo mới nhất trước
          'DESC',
          {} // Không có filter đặc biệt
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

  // ✅ Không cần sắp xếp lại nữa vì đã sắp xếp từ backend, chỉ cần giới hạn 10 sản phẩm
  const newProducts = products.slice(0, 10);

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
        Sản phẩm mới ✨
      </Typography>
      <Typography variant="body2" mb={3} align="center">
        Cập nhật những mẫu thiết kế mới nhất từ Dola Style!
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
          {newProducts.length > 0 ? (
            newProducts.map((product) => (
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
              Không có sản phẩm mới nào.
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

export default NewProducts;