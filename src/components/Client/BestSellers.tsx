import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from './ProductCard';
import { products } from '../../data/products';

const BestSellers: React.FC = () => {
  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 5;
  const containerWidth = visibleCount * (productWidth + productMarginRight);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

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
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Bán chạy trong tháng 🏆
      </Typography>
      <Typography variant="body2" mb={3}>
        Những sản phẩm được yêu thích và mua nhiều nhất trong tháng qua!
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={() => scrollByOneProduct('left')} size="large">
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
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {products.map((product) => (
            <Box key={product.id} flex="0 0 auto" sx={{ minWidth: productWidth, mr: 2 }}>
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        <IconButton onClick={() => scrollByOneProduct('right')} size="large">
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BestSellers;
