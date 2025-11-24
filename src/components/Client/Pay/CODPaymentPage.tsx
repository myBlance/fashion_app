import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/CODPayment.css';
import { CartItem } from '../../../types/CartItem';

interface OrderResponse {
  _id: string;
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

const CODPaymentPage: React.FC = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref để tránh useEffect gọi API 2 lần trong React Strict Mode
  const hasCreatedOrder = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    cartItems,
    totalAmount,
    shippingFee = 0,
    shippingMethod = 'standard', // Mặc định nếu không truyền
    discountAmount = 0,
    selectedAddress,
    userId,
  } = location.state || {};

  const finalAmount = totalAmount - (discountAmount || 0) + (shippingFee || 0);

  useEffect(() => {
    // 1. Kiểm tra dữ liệu đầu vào
    if (!location.state || !cartItems || cartItems.length === 0 || !userId) {
      // Nếu reload trang làm mất state, quay về giỏ hàng
      navigate('/cart'); 
      return;
    }

    // 2. Chặn gọi API nếu đã gọi rồi
    if (hasCreatedOrder.current) return;
    hasCreatedOrder.current = true;

    const createOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Nếu backend yêu cầu xác thực
        /* if (!token) {
          setError('Phiên đăng nhập không hợp lệ.');
          setIsLoading(false);
          return;
        } 
        */

        // Chuẩn bị payload
        const orderPayload = {
          id: `ORD-${Date.now()}`, // Tạo ID đơn hàng unique
          user: userId, // ✅ QUAN TRỌNG: Không được comment dòng này
          products: cartItems.map((item: CartItem) => ({
            product: item.productId || item.id, // Đảm bảo lấy đúng ID string
            quantity: item.quantity,
            selectedColor: item.color,
            selectedSize: item.size,
          })),
          totalPrice: finalAmount,
          status: 'pending',
          paymentMethod: 'cash-on-delivery', // Khớp với enum backend nếu có
          shippingMethod: shippingMethod,    // ✅ Thêm trường này
          shippingFee: shippingFee,          // ✅ Thêm trường này
          shippingAddress: {
            fullName: selectedAddress.name,
            phone: selectedAddress.phone,
            addressLine: selectedAddress.address,
            city: selectedAddress.city || '',
            district: selectedAddress.district || '',
            ward: selectedAddress.ward || ''
          },
        };

        console.log('Đang gửi đơn hàng:', orderPayload);

        const res = await axios.post<OrderResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
          orderPayload,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          }
        );

        setOrder(res.data);
        setIsLoading(false);

      } catch (err: any) {
        console.error('Lỗi tạo đơn COD:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Có lỗi xảy ra khi tạo đơn hàng.');
        setIsLoading(false);
      }
    };

    createOrder();
  }, [navigate, location.state, cartItems, userId, finalAmount, shippingFee, shippingMethod, selectedAddress]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    // Điều hướng tới trang lịch sử đơn hàng hoặc chi tiết đơn vừa tạo
    navigate('/order-history'); 
    // Hoặc nếu muốn xem chi tiết đơn vừa tạo:
    // navigate(`/order/${order?.id}`);
  };

  if (isLoading) {
    return (
      <div className="cod-container loading">
        <div className="spinner"></div>
        <p>Đang xử lý đơn hàng của bạn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cod-container error">
        <div className="icon-error">❌</div>
        <h2>Đặt hàng thất bại</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/checkout')} className="btn-retry">Thử lại</button>
        <button onClick={handleGoHome} className="btn-home">Về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="cod-container success">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
          <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2>Đặt hàng thành công!</h2>
      <p className="order-id">Mã đơn hàng: <strong>{order?.id}</strong></p>
      
      <div className="order-summary-card">
        <div className="summary-row">
          <span>Phương thức thanh toán:</span>
          <strong>Thanh toán khi nhận hàng (COD)</strong>
        </div>
        <div className="summary-row total">
          <span>Tổng thanh toán:</span>
          <strong>{finalAmount.toLocaleString()}₫</strong>
        </div>
        <p className="note">Vui lòng chuẩn bị số tiền tương ứng khi nhận hàng.</p>
      </div>

      <div className="buttons">
        <button onClick={handleGoHome} className="btn-home">Tiếp tục mua sắm</button>
        <button onClick={handleViewOrder} className="btn-order">Xem đơn hàng</button>
      </div>
    </div>
  );
};

export default CODPaymentPage;