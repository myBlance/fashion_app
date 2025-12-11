import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getProducts } from '../../../services/productService';
import { Product } from '../../../types/Product';
import ProductCard from '../Productcard/ProductCard';

interface SimilarProductsProps {
  currentProductId: string;
  currenttype: string; // Truyền type của sản phẩm hiện tại
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ currentProductId, currenttype }) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  //  Gọi API để lấy sản phẩm cùng loại
  useEffect(() => {
    if (!currenttype) {
      setLoading(false);
      return;
    }

    const fetchSimilarProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts(
          0, // offset
          20, // limit
          'createdAt', // sort field
          'DESC', // sort order
          { type: currenttype } // filter params
        );

        const filtered = Array.isArray(data)
          ? data.filter((product: Product) => product.id !== currentProductId)
          : [];

        setSimilarProducts(filtered);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm cùng loại:", err);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProductId, currenttype]); // ✅ Đảm bảo useEffect luôn chạy

  // ✅ Các hooks khác luôn được gọi
  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 5;
  const containerWidth = visibleCount * (productWidth + productMarginRight);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // ... (các hàm xử lý sự kiện không thay đổi)

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

  // ✅ Hiển thị loading hoặc không có sản phẩm
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (similarProducts.length === 0) {
    return null; // Không hiển thị nếu không có sản phẩm
  }

  // ✅ Render giao diện slider
  return (
    <Box p={4} mt={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
        Sản Phẩm Cùng Loại
      </Typography>
      <Typography variant="body2" mb={3} align="center">
        Khám phá thêm các sản phẩm tương tự với mẫu đang xem.
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
          {similarProducts.map((product) => (
            <Box
              key={product.id}
              flex="0 0 auto"
              sx={{ minWidth: productWidth, pl: 1, mr: 1, mb: 2, mt: 2 }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
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

export default SimilarProducts;