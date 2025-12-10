import { Favorite, FavoriteBorder } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { WishlistService } from '../../../services/wishlistService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleWishlist } from '../../../store/wishlistSlice';
import '../../../styles/ProductCard.css';
import { Product } from '../../../types/Product';
import QuickView from '../ProductDetail/QuickView';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userId } = useAuth();
  const { showToast } = useToast();
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
      showToast('Vui lòng đăng nhập để thêm sản phẩm yêu thích', 'warning');
      return;
    }
    if (loadingFavorite) return;

    setLoadingFavorite(true);
    try {
      await WishlistService.toggleItem(userId, product.id);
      dispatch(toggleWishlist(product.id));
    } catch (err) {
      console.error('Lỗi khi toggle wishlist:', err);
    } finally {
      setLoadingFavorite(false);
    }
  };

  // QuickView
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setSelectedProduct(null);
  };

  const discountPercentage = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div
        className="product-card"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Section */}
        <div className="product-card-image-wrapper">
          <img
            src={displayedImage}
            alt={product.name}
            className="product-card-image"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* Gradient Overlay */}
          <div className="product-card-image-overlay" />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="product-card-discount-badge">
              -{discountPercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            className={`product-card-wishlist-btn ${isFavoriteLocal ? 'is-favorite' : ''}`}
            onClick={handleToggleWishlist}
            disabled={loadingFavorite}
            aria-label="Add to wishlist"
          >
            {isFavoriteLocal ? <Favorite /> : <FavoriteBorder />}
          </button>

          {/* Sale Badge */}
          {product.sale && (
            <div className="product-card-sale-badge">
              Khuyến mãi đặc biệt
            </div>
          )}

          {/* Hover Action Buttons */}
          <div className="product-card-actions">
            <button
              className="product-card-action-btn primary"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Xem chi tiết
            </button>
            <button
              className="product-card-action-btn secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenQuickView(product);
              }}
            >
              Xem nhanh
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="product-card-content">
          {/* Product Name */}
          <h3 className="product-card-name">{product.name}</h3>

          {/* Price */}
          <div className="product-card-price-wrapper">
            <span className="product-card-price">
              {product.price.toLocaleString()}đ
            </span>
            {product.originalPrice > product.price && (
              <span className="product-card-original-price">
                {product.originalPrice.toLocaleString()}đ
              </span>
            )}
          </div>

          {/* Color Swatches */}
          <div className="product-card-colors">
            {product.colors.map((color, idx) => (
              <div
                key={idx}
                className="product-card-color-dot"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Sold Progress */}
          <div className="product-card-progress-section">
            <div className="product-card-progress-bar">
              <div
                className="product-card-progress-fill"
                style={{ width: `${soldPercentage}%` }}
              />
            </div>
            <span className="product-card-sold-text">
              Đã bán {product.sold}
            </span>
          </div>
        </div>
      </div>

      {/* QuickView Modal */}
      {selectedProduct && (
        <QuickView open={quickViewOpen} onClose={handleCloseQuickView} product={selectedProduct} />
      )}
    </>
  );
};

export default ProductCard;
