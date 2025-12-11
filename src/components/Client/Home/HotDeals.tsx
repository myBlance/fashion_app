// src/components/Client/HotDeals.tsx
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Alert, Box, CircularProgress, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getProducts } from '../../../services/productService'; // ✅ reuse service
import { Product } from '../../../types/Product';
import ProductCard from '../Productcard/ProductCard';

const HotDeals: React.FC = () => {
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI scroll config
  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 5;
  const containerWidth = visibleCount * (productWidth + productMarginRight);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Fetch hot deals từ backend (fallback: fetch all and filter on client)
  useEffect(() => {
    const loadHotDeals = async () => {
      setLoading(true);
      setError(null);
      try {
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

        // 🔁 Fallback: Lọc sản phẩm có giá gốc > giá hiện tại (tức là đang giảm giá)
        // và sắp xếp theo mức giảm giá (originalPrice - price) giảm dần
        const deals = allProducts
          .filter(p => p.originalPrice > 0 && p.price < p.originalPrice) // Sản phẩm đang giảm giá
          .sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price)); // Sắp xếp theo mức giảm

        // Giới hạn số lượng deal nổi bật (ví dụ: 20 sản phẩm đầu tiên)
        setHotDeals(deals.slice(0, 20));
      } catch (err) {
        console.error('❌ Lỗi khi tải Hot Deals:', err);
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        setHotDeals([]);
      } finally {
        setLoading(false);
      }
    };

    loadHotDeals();
  }, []);

  // 🖱️ Scroll logic (unchanged)
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    setIsDragging(false);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
    setTimeout(() => setIsDragging(false), 0);
    window.getSelection()?.removeAllRanges();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;

    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const scrollByOneProduct = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = productWidth + productMarginRight;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  // 🖼 Render
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
        Deal nổi bật
      </Typography>

      {/* ✅ Chỉ hiển thị thông báo nếu KHÔNG có deal */}
      {hotDeals.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary" py={2}>
          Hiện chưa có sản phẩm nào đang giảm giá.
        </Typography>
      ) : null}

      <Box display="flex" alignItems="center" gap={1} justifyContent="center" sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        <IconButton
          onClick={() => scrollByOneProduct('left')}
          aria-label="Cuộn sang trái"
          size="large"
          disabled={!scrollRef.current || scrollRef.current.scrollLeft <= 0}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={scrollRef}
          display="flex"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onClickCapture={handleClickCapture}
          sx={{
            overflowX: 'auto',
            width: '100%', // Responsive width
            maxWidth: containerWidth,
            cursor: isDown.current ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollBehavior: 'smooth',
            gap: { xs: 1, md: 3 } // Responsive gap
          }}
        >
          {hotDeals.map((product) => (
            <Box
              key={product.id}
              flex="0 0 auto"
              sx={{
                minWidth: productWidth,
                // Removed pl: 1, mr: 1 to use gap
                mb: 2,
                mt: 2,
              }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={() => scrollByOneProduct('right')}
          aria-label="Cuộn sang phải"
          size="large"
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HotDeals;