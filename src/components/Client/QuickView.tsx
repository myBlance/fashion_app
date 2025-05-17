import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';

interface Product {
  id: string;               // bổ sung id
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  status: boolean;
  colors: string[];
  sizes: string[];
}

interface QuickViewProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  onAddToCart?: (color: string, size: string, quantity: number) => void;
}

const QuickView: React.FC<QuickViewProps> = ({ open, onClose, product, onAddToCart }) => {
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColor(product.colors[0] || '');
      setSelectedSize(product.sizes[0] || '');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!product) return null;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Vui lòng chọn màu và size');
      return;
    }

    if (onAddToCart) {
      onAddToCart(selectedColor, selectedSize, quantity);
    } else {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          color: selectedColor,
          size: selectedSize,
          price: product.price,
          quantity,
          image: product.images[selectedImage],
        })
      );
      alert('Đã thêm vào giỏ!');
      // navigate('/cart'); // nếu bạn dùng react-router, nhớ import và gọi navigate ở đây
    }
  };

  return (
    <>
      {open && (
        <Box
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 1400,
          }}
        />
      )}

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 360,
          bgcolor: 'background.paper',
          boxShadow: '-3px 0 10px rgba(0,0,0,0.1)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1500,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid #ddd',
            bgcolor: 'error.main',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          <Typography variant="h6">Xem nhanh</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
          {/* Main Image */}
          <Box
            component="img"
            src={product.images[selectedImage]}
            alt={product.name}
            sx={{ width: '100%', height: 180, objectFit: 'contain', mb: 1 }}
          />

          {/* Thumbnails */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {product.images.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={img}
                alt={`${product.name} ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'contain',
                  cursor: 'pointer',
                  border: selectedImage === index ? '2px solid #b71c1c' : '1px solid #ddd',
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>

          {/* Product Info */}
          <Typography variant="h6" fontWeight="bold" mb={1}>
            {product.name}
          </Typography>

          <Typography variant="body1" mb={1}>
            Tình trạng:{' '}
            <Typography component="span" color={product.status ? 'error' : 'text.secondary'}>
              {product.status ? 'Còn hàng' : 'Hết hàng'}
            </Typography>
          </Typography>

          <Typography variant="h5" color="error" fontWeight="bold" mb={2}>
            {product.price.toLocaleString()}đ
            <Typography
              component="span"
              sx={{ textDecoration: 'line-through', color: '#999', ml: 1, fontWeight: 'normal', fontSize: 14 }}
            >
              {product.originalPrice.toLocaleString()}đ
            </Typography>
          </Typography>

          {/* Color selection */}
          <Box mb={1}>
            <Typography fontWeight="bold" mb={0.5}>
              Màu sắc:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? 'contained' : 'outlined'}
                  color={selectedColor === color ? 'error' : 'inherit'}
                  size="small"
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    textTransform: 'none',
                    minWidth: 70,
                    bgcolor: selectedColor === color ? color : undefined,
                    color: selectedColor === color ? 'white' : 'inherit',
                    borderColor: selectedColor === color ? '#b71c1c' : undefined,
                  }}
                >
                  {color}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Size selection */}
          <Box mb={1}>
            <Typography fontWeight="bold" mb={0.5}>
              Size:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'contained' : 'outlined'}
                  color={selectedSize === size ? 'error' : 'inherit'}
                  size="small"
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    minWidth: 40,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    borderColor: selectedSize === size ? '#b71c1c' : undefined,
                    bgcolor: selectedSize === size ? '#b71c1c' : undefined,
                    color: selectedSize === size ? 'white' : 'inherit',
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Quantity selection */}
          <Box mb={2}>
            <Typography fontWeight="bold" mb={0.5}>
              Số lượng:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleQuantityChange(-1)}
                sx={{ minWidth: 36, padding: 0, fontWeight: 'bold' }}
              >
                -
              </Button>
              <Typography
                sx={{
                  border: '1px solid #b71c1c',
                  px: 2,
                  py: '6px',
                  minWidth: 32,
                  textAlign: 'center',
                  borderRadius: 1,
                  userSelect: 'none',
                }}
              >
                {quantity}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleQuantityChange(1)}
                sx={{ minWidth: 36, padding: 0, fontWeight: 'bold' }}
              >
                +
              </Button>
            </Box>
          </Box>

          {/* Add to cart */}
          <Button
            className="btn add-to-cart"
            onClick={handleAddToCart}
            variant="contained"
            fullWidth
            color="error"
            disabled={!product.status}
            sx={{ fontWeight: 'bold' }}
          >
            THÊM VÀO GIỎ HÀNG
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default QuickView;
