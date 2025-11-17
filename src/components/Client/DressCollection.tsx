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
import { Product } from '../../types/Product'; // ✅ Import type

// ✅ Hàm gọi API
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

const DressCollection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productWidth = 220;
  const productMarginRight = 16;
  const visibleCount = 3;
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

  // ✅ Lọc sản phẩm theo type = 'váy'
  const dressProducts = products.filter((product) => product.type === 'váy');

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
    <Box display="flex" gap={2} p={2} justifyContent="center">
      {/* Banner bên trái */}
      <Box
        sx={{
          position: 'relative',
          width: '380px',
          height: '480px',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundImage: 'url(/assets/images/dressbaner_3.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginLeft: 5,
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
            color="red"
            sx={{ textTransform: 'uppercase', mt: 1 }}
          >
            Váy
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3, backgroundColor: 'white', color: 'black' }}
          >
            Xem ngay
          </Button>
        </Box>
      </Box>

      {/* Danh sách sản phẩm */}
      <Box display="flex" alignItems="center" gap={1}>
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
          sx={{
            overflowX: 'auto',
            width: containerWidth,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {dressProducts.length > 0 ? (
            dressProducts.map((product) => (
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
              Không có sản phẩm váy nào.
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

export default DressCollection;