import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../../services/productService';
import { Product } from '../../../types/Product';
import ProductCard from '../Productcard/ProductCard';

const ShirtCollection: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // responsive dynamic values
  const [productWidth, setProductWidth] = useState(220);
  const [bannerSize, setBannerSize] = useState({ w: 380, h: 480 });
  const [visibleCount, setVisibleCount] = useState(3);

  const productMarginRight = 16;

  // ⭐ Responsive calculation
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      if (width < 600) {
        // Mobile
        setProductWidth(220);
        setBannerSize({ w: '100%' as any, h: 340 });
        setVisibleCount(1.3);
      } else if (width < 900) {
        // Tablet
        setProductWidth(220);
        setBannerSize({ w: '100%' as any, h: 400 });
        setVisibleCount(2.5);
      } else {
        // Desktop
        setProductWidth(220);
        setBannerSize({ w: 380, h: 480 });
        setVisibleCount(3);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);

    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const containerWidth = visibleCount * (productWidth + productMarginRight);

  // Load products
  useEffect(() => {
    const loadShirtProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts(0, 100, 'createdAt', 'DESC', {
          type: 'Áo',
        });

        const shirts = (data || []).filter((p: Product) => p.type === 'Áo');
        setProducts(shirts);
      } catch (err) {
        setError('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    loadShirtProducts();
  }, []);

  const scrollByOneProduct = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = productWidth + productMarginRight;

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleViewAll = () => {
    navigate('/shop?type=Áo');
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={3}
      p={2}
      justifyContent="center"
      alignItems={{ xs: 'center', md: 'flex-start' }}
    >
      {/* Banner - Hiển thị đầu tiên trên mobile */}
      <Box
        sx={{
          order: { xs: 1, md: 2 },
          position: 'relative',
          width: { xs: '100%', sm: '100%', md: `${bannerSize.w}px` },
          maxWidth: { xs: '100%', sm: '500px', md: `${bannerSize.w}px` },
          height: `${bannerSize.h}px`,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundImage: 'url(/assets/images/tshirtbaner_1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            textAlign: 'center',
            textShadow: '0 0 12px rgba(0,0,0,0.6)',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Bộ sưu tập
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            color="#e53935"
            sx={{ textTransform: 'uppercase', mt: 1 }}
          >
            Áo
          </Typography>

          <Button
            variant="contained"
            onClick={handleViewAll}
            sx={{
              mt: 3,
              backgroundColor: '#fff',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#eee' },
            }}
          >
            Xem ngay
          </Button>
        </Box>
      </Box>

      {/* Product slider - Hiển thị sau banner trên mobile */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        width={{ xs: '100%', md: 'auto' }}
        justifyContent="center"
        sx={{ order: { xs: 2, md: 1 } }}
      >
        <IconButton onClick={() => scrollByOneProduct('left')}>
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={scrollRef}
          display="flex"
          sx={{
            overflowX: 'auto',
            width: { xs: '100%', md: containerWidth },
            maxWidth: { xs: '85vw', sm: '90vw', md: containerWidth },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {products.map((product) => (
            <Box
              key={product.id}
              flex="0 0 auto"
              sx={{ minWidth: { xs: 220, md: productWidth }, mr: 2 }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        <IconButton onClick={() => scrollByOneProduct('right')}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ShirtCollection;
