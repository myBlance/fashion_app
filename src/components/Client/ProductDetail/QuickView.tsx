import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { CartService } from "../../../services/cartService";
import { addToCart } from "../../../store/cartSlice";
import '../../../styles/QuickView.css';
import { CartItem } from '../../../types/CartItem';
import { Product } from '../../../types/Product';

interface QuickViewProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart?: (color: string, size: string, quantity: number) => void;
}

const QuickView: React.FC<QuickViewProps> = ({ open, onClose, product, onAddToCart }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const { userId: authUserId } = useAuth();
  const userId = authUserId || sessionStorage.getItem("userId");

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

  const handleAddToCart = async () => {
    if (!product) return;

    const colorIndex = product.colors.indexOf(selectedColor);
    const actualColorIndex = colorIndex >= 0 ? colorIndex : 0;

    const newItem: Omit<CartItem, "id"> = {
      productId: product.id,
      name: product.name,
      color: product.colors[actualColorIndex] || "Chưa chọn",
      size: selectedSize,
      price: product.price,
      quantity,
      image: product.images[actualColorIndex] || product.thumbnail || "",
    };

    try {
      if (userId) {
        const savedItem = await CartService.addToCart(userId, newItem);
        const cartItem: CartItem = {
          ...newItem,
          id: savedItem.id,
        };
        dispatch(addToCart(cartItem));
      } else {
        dispatch(addToCart(newItem as CartItem));
      }
      showToast("Đã thêm vào giỏ!", "success");
      if (onAddToCart) {
        onAddToCart(product.colors[actualColorIndex], selectedSize, quantity);
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      showToast("Thêm vào giỏ thất bại. Vui lòng thử lại.", "error");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`quickview-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={`quickview-panel ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="quickview-header">
          <h3>Xem nhanh</h3>
          <button className="quickview-close-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="quickview-content">
          {/* Main Image */}
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="quickview-main-image"
          />

          {/* Thumbnails */}
          <div className="quickview-thumbnails">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                onClick={() => setSelectedImage(index)}
                className={`quickview-thumbnail ${selectedImage === index ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* Product Info */}
          <h3 className="quickview-product-name">{product.name}</h3>

          <div className="quickview-status">
            Tình trạng:
            <span className={`quickview-status-value ${product.status ? 'available' : 'unavailable'}`}>
              {product.status ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>

          {/* Price */}
          <div className="quickview-price-wrapper">
            <span className="quickview-price">
              {product.price.toLocaleString()}đ
            </span>
            <span className="quickview-original-price">
              {product.originalPrice.toLocaleString()}đ
            </span>
          </div>

          {/* Color selection */}
          <div className="quickview-option-section">
            <label className="quickview-option-label">Màu sắc:</label>
            <div className="quickview-color-options">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`quickview-color-btn ${selectedColor === color ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div className="quickview-option-section">
            <label className="quickview-option-label">Size:</label>
            <div className="quickview-size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`quickview-size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selection */}
          <div className="quickview-option-section">
            <label className="quickview-option-label">Số lượng:</label>
            <div className="quickview-quantity-controls">
              <button
                className="quickview-quantity-btn"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <div className="quickview-quantity-display">
                {quantity}
              </div>
              <button
                className="quickview-quantity-btn"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            className="quickview-add-to-cart"
            onClick={handleAddToCart}
            disabled={!product.status}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </>
  );
};

export default QuickView;