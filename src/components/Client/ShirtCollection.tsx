import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from './ProductCard';
import { Product } from '../../types/Product';
import { getProducts } from '../../services/productService';

const ShirtCollection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 3;
  const containerWidth = visibleCount * (productWidth + productMarginRight);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadShirtProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getProducts(
          0,
          20,
          'createdAt',
          'DESC',
          { type: 'Áo' } // ✅ filter ở backend
        );

        const allProducts: Product[] = Array.isArray(data) ? data : [];
        
        // 🔁 Fallback: Lọc các sản phẩm có type là 'Váy' (giống ShopPage)
        const ShirtProducts = allProducts.filter(p => p.type === 'Áo');

        setProducts(ShirtProducts);
      } catch (err) {
        console.error('❌ Lỗi khi tải bộ sưu tập Áo:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
        setProducts([]);
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
    window.location.href = '/shop?type=áo';
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
    <Box display="flex" gap={2} p={2} justifyContent="center" mr={10}>
      {/* Danh sách sản phẩm */}
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          onClick={() => scrollByOneProduct('left')}
          aria-label="Cuộn trái"
          size="large"
        >
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
          {products.length > 0 ? (
            products.map((product) => (
              <Box
                key={product.id}
                flex="0 0 auto"
                sx={{ minWidth: productWidth, pl: 1, mr: 1, mb: 2, mt: 2 }}
              >
                <ProductCard product={product} />
              </Box>
            ))
          ) : (
            <Typography
              variant="body1"
              align="center"
              width="100%"
              color="text.secondary"
              sx={{ alignSelf: 'center', px: 2 }}
            >
              Chưa có sản phẩm nào trong bộ sưu tập này.
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={() => scrollByOneProduct('right')}
          aria-label="Cuộn phải"
          size="large"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Banner bên phải */}
      <Box
        sx={{
          position: 'relative',
          width: '380px',
          height: '480px',
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
            bottom: '40%',
            left: '30%',
            color: '#fff',
            textShadow: '0 0 10px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Bộ sưu tập
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="#e53935"
            sx={{ textTransform: 'uppercase', mt: 1 }}
          >
            Áo
          </Typography>
          <Button
            variant="contained"
            onClick={handleViewAll}
            sx={{ mt: 3, backgroundColor: 'white', color: 'black', '&:hover': { backgroundColor: '#f5f5f5' } }}
          >
            Xem ngay
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShirtCollection;