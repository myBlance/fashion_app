import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  LinearProgress,
  Button,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleWishlist } from '../../store/wishlistSlice';
import { Product as ProductServiceProduct } from '../../services/productService';
import QuickView from '../Client/QuickView';
import { useAuth } from '../../contexts/AuthContext';
import { WishlistService } from '../../services/wishlistService';

interface ProductCardProps {
  product: ProductServiceProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId } = useAuth();
  const wishlist = useAppSelector((state) => state.wishlist.items);

  const [hovered, setHovered] = useState(false);
  const [isFavoriteLocal, setIsFavoriteLocal] = useState(wishlist.includes(product.id));
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const soldPercentage = (product.sold / product.total) * 100;
  const displayedImage = hovered ? product.images[1] || product.images[0] : product.images[0];

  // Đồng bộ khi wishlist trong Redux thay đổi
  useEffect(() => {
    setIsFavoriteLocal(wishlist.includes(product.id));
  }, [wishlist, product.id]);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      alert('Vui lòng đăng nhập để thêm sản phẩm yêu thích');
      return;
    }
    if (loadingFavorite) return; // tránh nhấp liên tục

    setLoadingFavorite(true);
    try {
      await WishlistService.toggleItem(userId, product.id);
      dispatch(toggleWishlist(product.id)); // cập nhật Redux
    } catch (err) {
      console.error('Lỗi khi toggle wishlist:', err);
    } finally {
      setLoadingFavorite(false);
    }
  };

  // QuickView
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductServiceProduct | null>(null);

  const handleOpenQuickView = (product: ProductServiceProduct) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="card-container">
      <Card
        sx={{
          width: 220,
          position: 'relative',
          cursor: 'pointer',
          transition: '0.3s',
          '&:hover': { boxShadow: 6 },
          overflow: 'visible',
        }}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Discount Chip */}
        {product.originalPrice > product.price && (
          <Chip
            label={`-${Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            )}%`}
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8, zIndex: 3 }}
          />
        )}

        {/* Wishlist Icon */}
        <IconButton
          onClick={handleToggleWishlist}
          disabled={loadingFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 3,
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#fce4ec' },
          }}
        >
          {isFavoriteLocal ? <Favorite sx={{ color: '#e91e63' }} /> : <FavoriteBorder sx={{ color: '#999' }} />}
        </IconButton>

        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="260"
            image={displayedImage}
            alt={product.name}
            sx={{ transition: '0.3s' }}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{ userSelect: 'none' }}
          />

          {product.sale && (
            <Chip
              label="Khuyến mãi đặc biệt"
              color="warning"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                zIndex: 3,
                bgcolor: 'warning.main',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}

          {/* Hover Buttons */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              zIndex: 4,
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              pointerEvents: hovered ? 'auto' : 'none',
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenQuickView(product);
              }}
              sx={{
                color: '#000',
                borderColor: '#000',
                '&:hover': { borderColor: '#000', bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              Xem nhanh
            </Button>
          </Box>
        </Box>

        {/* Card Content */}
        <CardContent>
          <Typography variant="body1" fontWeight="bold">
            {product.name.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="error" fontWeight="bold">
            {product.price.toLocaleString()}đ{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{ textDecoration: 'line-through', color: '#999' }}
            >
              {product.originalPrice.toLocaleString()}đ
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {product.colors.map((color, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: color,
                  border: '1px solid #ccc',
                }}
              />
            ))}
          </Box>
          <Box mt={1}>
            <LinearProgress variant="determinate" value={soldPercentage} />
            <Typography variant="caption">Đã bán {product.sold}</Typography>
          </Box>
        </CardContent>
      </Card>

      {selectedProduct && (
        <QuickView open={quickViewOpen} onClose={handleCloseQuickView} product={selectedProduct} />
      )}
    </div>
  );
};

export default ProductCard;
