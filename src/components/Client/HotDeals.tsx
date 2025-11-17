import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Alert } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product';

// ✅ Hàm gọi API đúng
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
    }
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi API /api/products:', error);
    throw error;
  }
};

const HotDeals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 5;
  const containerWidth = visibleCount * (productWidth + productMarginRight);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

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

  // ✅ Lọc và sắp xếp sản phẩm theo mức giảm giá (originalPrice - price)
  const hotDeals = products
    .filter(product => product.originalPrice && product.originalPrice > product.price) // Có giảm giá
    .sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price)); // Giảm nhiều nhất lên đầu

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    setIsDragging(false);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
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
    if (direction === 'left') {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
        Deal nổi bật 🔥
      </Typography>
      <Typography variant="body2" mb={3} align="center">
        Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
      </Typography>

      <Box display="flex" alignItems="center" gap={1} justifyContent="center">
        <IconButton
          onClick={() => scrollByOneProduct('left')}
          aria-label="scroll left"
          size="large"
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
            width: containerWidth,
            cursor: isDown.current ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitUserDrag: 'none',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {hotDeals.length > 0 ? (
            hotDeals.map((product) => (
              <Box
                key={product.id}
                flex="0 0 auto"
                sx={{ minWidth: productWidth, pl: 1, mr: 1, mb: 2, mt: 2 }}
              >
                {/* ✅ Bỏ dòng `status` không cần thiết */}
                <ProductCard product={product} />
              </Box>
            ))
          ) : (
            <Typography variant="body1" align="center" width="100%">
              Không có sản phẩm nào đang giảm giá.
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={() => scrollByOneProduct('right')}
          aria-label="scroll right"
          size="large"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default HotDeals;