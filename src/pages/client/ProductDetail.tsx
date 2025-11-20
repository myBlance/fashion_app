import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import DynamicBreadcrumbs from "../../components/Client/DynamicBreadcrumbs";
import ProductDetailTabs from "../../components/Client/ProductDetail/ProductDetailTabs"; // Đảm bảo component này đã được cập nhật
import SimilarProducts from "../../components/Client/ProductDetail/SimilarProducts";
import StorePolicies from "../../components/Client/ProductDetail/StorePolicies";
import { useAuth } from '../../contexts/AuthContext';
import { CartService } from "../../services/cartService";
import { getProductById } from "../../services/productService";
import { addToCart } from "../../store/cartSlice";
import { useAppSelector } from "../../store/hooks";
import { toggleWishlist } from "../../store/wishlistSlice";
import "../../styles/ProductDetail.css";
import { CartItem } from "../../types/CartItem";
import { Product } from "../../types/Product";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id là productId
  const dispatch = useDispatch();
  const { userId: authUserId, loading: authLoading } = useAuth();

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
      const thumbnailUrl =
        product.thumbnail?.startsWith("http")
          ? product.thumbnail
          : `${baseURL}/uploads/${product.thumbnail}`;
      setSelectedImage(thumbnailUrl || product.images[0]);
    }
  }, [product]);

  const isFavorite = product ? wishlist.includes(product.id) : false;
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const sizes = product?.sizes?.length ? product.sizes : ["S", "M", "L"];

  const getImageUrl = (path: string) => {
    if (!path) return "/no-image.png";
    if (path.startsWith("http")) return path;
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    return `${baseURL}/uploads/${path}`;
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    // Chỉ gửi productId cho backend, id sẽ lấy từ backend
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
      const savedItem = await CartService.addToCart(userId, newItem);
      const cartItem: CartItem = {
        ...newItem,
        id: savedItem.id, 
      };
      dispatch(addToCart(cartItem));
      alert("Đã thêm vào giỏ!");
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      alert("Thêm vào giỏ thất bại. Vui lòng thử lại.");
    }
  };

  if (loading || authLoading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error || !product) return <div className="not-found">{error || "Không tìm thấy sản phẩm"}</div>;

  return (
    <div>
      <DynamicBreadcrumbs />
      <div className="product-detail">
        {/* Thumbnails */}
        <div className="left-column">
          {product.thumbnail && (
            <img
              src={getImageUrl(product.thumbnail)}
              alt="avatar"
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
        <div className="middle-column">
          <img src={selectedImage} alt={product.name} className="main-image" />
          <IconButton
            onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product.id)); }}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 2, backgroundColor: "white", "&:hover": { backgroundColor: "#e2004b" } }}
          >
            {isFavorite ? <Favorite sx={{ color: "#e91e63" }} /> : <FavoriteBorder sx={{ color: "#999" }} />}
          </IconButton>
        </div>

        {/* Info */}
        <div className="right-column">
          <h2>{product.name}</h2>
          <div className="info-row">
            <div>
              Loại: <span className="highlight">{product.type}</span><br />
              Tình trạng: <span className={`highlight status ${product.status ? "available" : "unavailable"}`}>{product.status ? "Còn hàng" : "Hết hàng"}</span>
            </div>
            <div>
              Thương hiệu: <span className="highlight">{product.brand}</span><br />
              Mã sản phẩm: <span className="highlight code">{product.id}</span>
            </div>
          </div>
          <div className="price-section">
            <div className="price-label">Giá bán:</div>
            <div className="price-row">
              <span className="price">{product.price.toLocaleString()}₫</span>
              <span className="original-price">{product.originalPrice.toLocaleString()}₫</span>
            </div>
          </div>

          {/* Colors */}
          <div className="colors-section">
            <strong>Màu sắc: {product.colors[selectedColorIndex] || 'Chưa chọn'}</strong>
            <div className="color-options" style={{ display: 'flex', gap: 8 }}>
              {product.colors.map((color, idx) => (
                <label key={idx} className={`color-label ${selectedColorIndex === idx ? 'selected' : ''}`} onClick={() => setSelectedColorIndex(idx)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: color, border: selectedColorIndex === idx ? '2px solid black' : '1px solid #ccc', marginBottom: 4 }} />
                  <span style={{ fontSize: 12 }}>{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="sizes-section">
            <strong>Size: {selectedSize}</strong>
            <div className="size-options">
              {sizes.map((size) => (
                <button key={size} className={`size-btn ${selectedSize === size ? "selected" : ""}`} onClick={() => setSelectedSize(size)}>{size}</button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity-section">
            <label>Số lượng:</label>
            <div className="quantity-controls">
              <button className="quantity-btn" onClick={decreaseQuantity}>−</button>
              <input type="text" value={quantity} readOnly />
              <button className="quantity-btn" onClick={increaseQuantity}>+</button>
            </div>
          </div>

          {/* Action */}
          <div className="action-buttons">
            <button className="btn add-to-cart" onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
            <button className="btn buy-now" onClick={() => alert("Chuyển đến thanh toán")}>MUA NGAY</button>
          </div>
          <div>
            <StorePolicies />
          </div>
        </div>
      </div>

      <Box>
        {/* ✅ Truyền productId vào ProductDetailTabs */}
        <ProductDetailTabs
            productId={product._id}
            description={product.description || ''}
            details={product.details || ''}
        />
        <SimilarProducts
          currentProductId={product.id}
          currenttype={product.type} // Truyền type
        />
      </Box>
    </div>
  );
};

export default ProductDetail;