import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { products } from '../../data/products';
import { addToCart } from '../../store/cartSlice';
import '../../styles/ProductDetail.css';
import DynamicBreadcrumbs from '../../components/Client/DynamicBreadcrumbs';
import { Favorite, FavoriteBorder} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { toggleWishlist } from '../../store/wishlistSlice';
import { useAppSelector } from '../../store/hooks';



const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const product = products.find((p) => p.id === id);
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const wishlist = useAppSelector((state) => state.wishlist.items);
    const isFavorite = wishlist.includes(product!.id);

    const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product!.id));
    };

    // State chọn ảnh thumbnail hiện tại
    const [selectedImage, setSelectedImage] = useState('');
    // State chọn màu sắc (index trong product.images)
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    // State chọn size
    const [selectedSize, setSelectedSize] = useState('L');
    // State số lượng
    const [quantity, setQuantity] = useState(1);

  // Khởi tạo selectedImage khi product có dữ liệu
    useEffect(() => {
        if (product) {
        setSelectedImage(product.thumbnail || product.images[0]);
        }
    }, [product]);

    if (!product) {
        return <div className="not-found">Không tìm thấy sản phẩm</div>;
    }

    const sizes = ['S', 'M', 'L'];

    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleVoucherClick = (id: string) => {
        alert(`Bạn đã chọn voucher: ${id}`);
    };

    return (
        <div>
            <DynamicBreadcrumbs />
            <div className="product-detail">
            {/* Cột 1: thumbnails ảnh nhỏ */}
                <div className="left-column">
                    {product.images.map((img, i) => (
                        <img
                            src={img}
                            alt={`thumb-${i}`}
                            key={i}
                            className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>

            {/* Cột 2: ảnh lớn */}
                <div className="middle-column">
                    <img src={selectedImage} alt={product.name} className="main-image" />
                    <IconButton
                        onClick={handleToggleWishlist}
                        sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        backgroundColor: 'white',
                            '&:hover': {
                                backgroundColor: '#e2004b',
                            },
                        }}
                    >
                        {isFavorite ? (
                            <Favorite sx={{ color: '#e91e63' }} />
                        ) : (
                            <FavoriteBorder sx={{ color: '#999' }} />
                        )}
                    </IconButton>
                </div>

            {/* Cột 3: thông tin chi tiết */}
                <div className="right-column">
                    <h2>{product.name}</h2>

                    <div className="info-row">
                        <div>
                            Loại: <span className="highlight">
                                {product.category}
                            </span>
                                <br />
                            Tình trạng:{' '}
                            <span className={`highlight status ${product.status ? 'available' : 'unavailable'}`}>
                                {product.status ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </div>
                        <div>
                            Thương hiệu: <span className="highlight">{product.brand}</span>
                            <br />
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


                    <div className="promotion-list">
                        <div className="promotion-header">
                            <span className="icon">⚡</span> Danh sách khuyến mãi
                        </div>
                        <ul>
                            <li>✅ Áp dụng Phiếu quà tặng/ Mã giảm giá theo sản phẩm.</li>
                            <li>✅ Giảm giá 10% khi mua từ 5 sản phẩm trở lên.</li>
                            <li>🎁 Tặng 100.000₫ mua hàng tại website thành viên Dola Style, áp dụng khi mua Online tại Hồ Chí Minh và 1 số khu vực khác.</li>
                        </ul>
                    </div>

                    <div className="vouchers">
                        {['DOLA10', 'FREESHIP', 'DOLA20', 'DOLA50'].map((id) => (
                            <button
                                key={id}
                                className="voucher-btn"
                                onClick={() => handleVoucherClick(id)}
                            >
                                {id}
                            </button>
                        ))}
                    </div>

                    <div className="voucher-note">Tặng voucher trị giá 50k cho đơn hàng tiếp theo</div>

                    <div className="colors-section">
                        <strong>Màu sắc: {product.colors[selectedColorIndex] || 'Chưa chọn'}</strong>

                        <div className="color-options" style={{ display: 'flex', gap: 8 }}>
  {product.colors.map((color, idx) => (
    <label
      key={idx}
      className={`color-label ${selectedColorIndex === idx ? 'selected' : ''}`}
      onClick={() => setSelectedColorIndex(idx)}
      style={{ cursor: 'pointer', textAlign: 'center' }}
    >
      {/* Vòng tròn màu */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: color,
          border: selectedColorIndex === idx ? '2px solid black' : '1px solid #ccc',
          marginBottom: 4,
        }}
      />
      {/* Tên màu */}
      <span style={{ fontSize: 12 }}>{color}</span>

      {/* Biểu tượng đánh dấu màu đang chọn */}
      {selectedColorIndex === idx && <div className="corner-icon"></div>}
    </label>
  ))}
</div>


                    </div>

                    <div className="sizes-section">
                        <div className="size-label">
                            <strong>Size: 
                                <span> {selectedSize}</span>
                            </strong>
                        </div>
                        <div className="size-options">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                    {selectedSize === size && <div className="corner-icon">🏷️</div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="size-hint-btn" onClick={() => alert('Gợi ý tìm size')}>
                        <span className="icon">📐</span> Gợi ý tìm size
                    </button>

                    <div className="quantity-section">
                        <label>Số lượng:</label>
                        <div className="quantity-controls">
                            <button className="quantity-btn" onClick={decreaseQuantity}>
                            −
                            </button>
                            <input type="text" value={quantity} readOnly />
                            <button className="quantity-btn" onClick={increaseQuantity}>
                            +
                            </button>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn add-to-cart"
                            onClick={() => {
                                dispatch(
                                    addToCart({
                                        id: product.id,
                                        name: product.name,
                                        color: selectedColorIndex === 0 ? 'Trắng' : 'Đen',
                                        size: selectedSize,
                                        price: product.price,
                                        quantity,
                                        image: product.images[selectedColorIndex],
                                    })
                                );
                                alert('Đã thêm vào giỏ!');
                                // navigate('/cart'); // chuyển sang trang giỏ hàng
                            }}
                        >
                            THÊM VÀO GIỎ
                        </button>
                        <button className="btn buy-now" onClick={() => alert('Chuyển đến thanh toán')}>
                            MUA NGAY
                        </button>
                    </div>

                    <div className="commitment-section">
                        <h3>Cam kết của chúng tôi</h3>
                        <div className="commitment-list">
                            <div className="commitment-item">
                                <div className="icon">✔️</div>
                                <div>Cam kết 100% chính hãng</div>
                            </div>
                            <div className="commitment-item">
                                <div className="icon">✔️</div>
                                <div>Giao tận tay khách hàng</div>
                            </div>
                            <div className="commitment-item">
                                <div className="icon">✔️</div>
                                <div>Hỗ trợ 24/7</div>
                            </div>
                            <div className="commitment-item">
                                <div className="icon">✔️</div>
                                <div>Hoàn tiền 111% nếu hàng kém chất lượng</div>
                            </div>
                            <div className="commitment-item">
                                <div className="icon">✔️</div>
                                <div>Mở hộp kiểm tra nhận hàng</div>
                            </div>
                            <div className="commitment-item">
                                <div className="icon">✔️</div>
                                <div>Đổi trả trong 7 ngày</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
