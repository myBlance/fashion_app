import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs from "../../components/Client/Breadcrumb/DynamicBreadcrumbs";
import ProductDetailTabs from "../../components/Client/ProductDetail/ProductDetailTabs";
import SimilarProducts from "../../components/Client/ProductDetail/SimilarProducts";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { CartService } from "../../services/cartService";
import { getProductById } from "../../services/productService";
import { addToCart } from "../../store/cartSlice";
import { useAppSelector } from "../../store/hooks";
import { toggleWishlist } from "../../store/wishlistSlice";
import "../../styles/ProductDetail.css";
import { CartItem } from "../../types/CartItem";
import { Product } from "../../types/Product";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId: authUserId, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const wishlist = useAppSelector((state) => state.wishlist.items);
  const userId = authUserId || sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getProductById(id);
          setProduct(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const thumbnailUrl = product.thumbnail?.startsWith("http")
        ? product.thumbnail
        : `${baseURL}/uploads/${product.thumbnail}`;
      setSelectedImage(thumbnailUrl || product.images[0]);

      // Set default size if available
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  const isFavorite = product ? wishlist.includes(product.id) : false;
  const getCurrentStock = () => {
    if (!product) return 0;
    const selectedColor = product.colors[selectedColorIndex];
    if (product.variants && product.variants.length > 0) {
      const currentVariant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
      return currentVariant ? currentVariant.quantity : 0;
    }
    return product.total || 0;
  }

  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const increaseQuantity = () => {
    const stock = getCurrentStock();
    setQuantity((prev) => {
      if (prev >= stock) {
        showToast("Đã hết sản phẩm bạn chọn", "warning");
        return prev;
      }
      return prev + 1;
    });
  };
  const sizes = product?.sizes?.length ? product.sizes : ["S", "M", "L"];

  const getImageUrl = (path: string) => {
    if (!path) return "/no-image.png";
    if (path.startsWith("http")) return path;
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    return `${baseURL}/uploads/${path}`;
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const newItem: Omit<CartItem, "id"> = {
      productId: product.id,
      name: product.name,
      color: product.colors[selectedColorIndex] || "Chưa chọn",
      size: selectedSize,
      price: product.price,
      quantity,
      image: product.images[selectedColorIndex] || product.thumbnail || "",
    };

    try {
      // If user is logged in, save to backend
      if (userId) {
        const savedItem = await CartService.addToCart(userId, newItem);
        const cartItem: CartItem = {
          ...newItem,
          id: savedItem.id,
        };
        dispatch(addToCart(cartItem));
      } else {
        // If user is not logged in, just save to Redux (which auto-saves to localStorage)
        dispatch(addToCart(newItem as CartItem));
      }
      showToast("Đã thêm vào giỏ!", "success");
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      showToast("Thêm vào giỏ thất bại. Vui lòng thử lại.", "error");
    }
  };

  // Mua ngay: Đi thẳng đến thanh toán với sản phẩm này (không thêm vào giỏ)
  const handleBuyNow = async () => {
    if (!product) return;

    // Kiểm tra đăng nhập
    if (!userId) {
      showToast("Vui lòng đăng nhập để mua hàng", "warning");
      navigate('/auth?tab=login');
      return;
    }

    // Tạo item để checkout ngay
    const buyNowItem: CartItem = {
      id: `buynow-${Date.now()}`, // Temporary ID
      productId: product.id,
      name: product.name,
      color: product.colors[selectedColorIndex] || "Chưa chọn",
      size: selectedSize,
      price: product.price,
      quantity,
      image: product.images[selectedColorIndex] || product.thumbnail || "",
    };

    // Navigate đến checkout với sản phẩm trong state (không save vào cart)
    navigate('/checkout', {
      state: {
        buyNowItem,
        isBuyNow: true
      }
    });
  };

  if (loading || authLoading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error || !product) return <div className="not-found">{error || "Không tìm thấy sản phẩm"}</div>;

  return (
    <div className="product-detail-container">
      <DynamicBreadcrumbs />

      <div className="product-detail-wrapper">
        {/* Khu vực hiển thị ảnh (Gallery) */}
        <div className="gallery-container">
          {/* Thumbnails */}
          <div className="thumbnails-list">
            {product.thumbnail && (
              <img
                src={getImageUrl(product.thumbnail)}
                alt="thumbnail"
                className={`thumbnail ${selectedImage === getImageUrl(product.thumbnail) ? "active" : ""}`}
                onClick={() => setSelectedImage(getImageUrl(product.thumbnail))}
              />
            )}
            {product.images?.filter(img => img !== product.thumbnail).map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt={`thumb-${i}`}
                className={`thumbnail ${selectedImage === getImageUrl(img) ? "active" : ""}`}
                onClick={() => setSelectedImage(getImageUrl(img))}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="main-image-wrapper">
            <img src={selectedImage} alt={product.name} className="main-image" />
            <IconButton
              onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product.id)); }}
              className="favorite-btn"
            >
              {isFavorite ? <Favorite sx={{ color: "#e91e63" }} /> : <FavoriteBorder sx={{ color: "#999" }} />}
            </IconButton>
          </div>
        </div>

        {/* Khu vực thông tin sản phẩm (Info) */}
        <div className="info-container">
          <h1 className="product-title">{product.name}</h1>

          <div className="meta-info">
            <div>
              Loại: <span className="highlight">{product.type}</span> |
              Thương hiệu: <span className="highlight">{product.brand}</span>
            </div>
            <div>
              Mã SP: <span className="code">{product.id}</span> |
              Tình trạng:
              {(() => {
                const selectedColor = product.colors[selectedColorIndex];
                const currentVariant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
                const isAvailable = currentVariant ? currentVariant.quantity > 0 : (product.total > 0); // Fallback to total if no variants

                // Global status override
                if (product.status === 'stopped') {
                  return <span className="status unavailable">Ngừng kinh doanh</span>;
                }
                if (product.status === 'sold_out') {
                  return <span className="status unavailable">Hết hàng</span>;
                }

                return (
                  <span className={`status ${isAvailable ? "available" : "unavailable"}`}>
                    {isAvailable ? `Còn hàng (${currentVariant ? currentVariant.quantity : product.total})` : "Hết hàng"}
                  </span>
                );
              })()}
            </div>
          </div>

          <div className="price-section">
            <span className="current-price">{product.price.toLocaleString()}₫</span>
            {product.originalPrice > product.price && (
              <span className="original-price">{product.originalPrice.toLocaleString()}₫</span>
            )}
          </div>

          <div className="options-section">
            {/* Colors */}
            <div className="option-group">
              <span className="option-label">Màu sắc: <span className="selected-val">{product.colors[selectedColorIndex]}</span></span>
              <div className="color-list">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`color-item ${selectedColorIndex === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedColorIndex(idx)}
                    title={color}
                  >
                    <div style={{ backgroundColor: color }} className="color-circle" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="option-group">
              <span className="option-label">Kích cỡ: <span className="selected-val">{selectedSize}</span></span>
              <div className="size-list">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Dynamic Status below options */}
            <div className="option-group">

              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                {(() => {
                  const selectedColor = product.colors[selectedColorIndex];
                  // Strict check: Does product have variants?
                  const hasVariants = product.variants && product.variants.length > 0;

                  if (hasVariants) {
                    const currentVariant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
                    const qty = currentVariant ? currentVariant.quantity : 0;
                    const isAvailable = qty > 0;

                    return (
                      <span style={{
                        color: isAvailable ? '#4caf50' : '#f44336',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }}>
                        {isAvailable ? `Còn hàng (${qty} sản phẩm)` : "Hết hàng"}
                      </span>
                    );
                  }

                  // Legacy fallback (only if no variants array)
                  if (product.status === 'stopped') return <span className="status unavailable">Ngừng kinh doanh</span>;
                  if (product.status === 'sold_out') return <span className="status unavailable">Hết hàng</span>;
                  const isAvailable = product.total > 0;
                  return (
                    <span style={{
                      color: isAvailable ? '#4caf50' : '#f44336',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}>
                      {isAvailable ? `Còn hàng (${product.total} sản phẩm)` : "Hết hàng"}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Quantity */}
            <div className="option-group">
              <span className="option-label">Số lượng:</span>

              <div className="quantity-controls">
                <button onClick={decreaseQuantity}>−</button>
                <input type="text" value={quantity} readOnly />
                <button onClick={increaseQuantity}>+</button>
              </div>
            </div>


          </div>

          <div className="action-buttons">
            <button className="btn add-to-cart" onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
            <button className="btn buy-now" onClick={handleBuyNow}>MUA NGAY</button>
          </div>
        </div>
      </div>

      <Box className="product-bottom-section">
        <ProductDetailTabs
          productId={product._id}
          description={product.description || ''}
          details={product.details || ''}
        />
        <SimilarProducts
          currentProductId={product.id}
          currenttype={product.type}
        />
      </Box>
    </div>
  );
};

export default ProductDetail;