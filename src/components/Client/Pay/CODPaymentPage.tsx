import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/CODPayment.css';

interface OrderResponse {
  _id: string;
  id: string;
  status: string;
  user: string;
  products: Array<{
    product: string;
    quantity: number;
    selectedColor: string;
    selectedSize: string;
  }>;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
  };
  createdAt: string;
}

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
}


const CODPaymentPage: React.FC = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    cartItems,
    totalAmount,
    shippingFee = 0,
    discountAmount = 0,
    selectedAddress,
    userId,
  } = location.state || {};

  const finalAmount = totalAmount - (discountAmount || 0) + (shippingFee || 0);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0 || !userId) {
      navigate('/checkout');
      return;
    }

    const createOrder = async () => {
      try {
        const name = selectedAddress?.name || 'Khách hàng';
        const token = localStorage.getItem('token'); // ✅ Lấy token

        if (!token) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          setIsLoading(false);
          navigate('/login');
          return;
        }

        const res = await axios.post<OrderResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
          {
            id: `ORDER${Date.now()}`,
            user: userId,
            products: cartItems.map((item: CartItem) => ({
              product: item.productId,
              quantity: item.quantity,
              selectedColor: item.color,
              selectedSize: item.size,
            })),
            totalPrice: finalAmount,
            status: 'pending',
            paymentMethod: 'cod',
            shippingAddress: {
              fullName: selectedAddress.name,
              phone: selectedAddress.phone,
              addressLine: selectedAddress.address,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Gửi token
            },
          }
        );

        setOrder(res.data);
        setIsLoading(false);

      } catch (err: any) {
        console.error('Lỗi tạo đơn COD:', err.response?.data || err.message);
        setError('Không thể tạo đơn. Vui lòng thử lại.');
        setIsLoading(false);
      }
    };

    createOrder();
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    // Có thể chuyển đến trang chi tiết đơn hàng hoặc lịch sử đơn hàng
    navigate('/order-history');
  };

  if (isLoading) {
    return (
      <div className="cod-container">
        <div className="loader">Đang tạo đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cod-container error">
        <h2>❌ Lỗi</h2>
        <p>{error}</p>
        <button onClick={handleGoHome}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="cod-container success">
      <div className="success-icon">📦</div>
      <h2>Đặt hàng thành công!</h2>
      <p>Đơn hàng <strong>{order?.id}</strong> đã được tạo.</p>
      <p>Phương thức thanh toán: <strong>Thanh toán khi nhận hàng (COD)</strong></p>
      <p>Số tiền cần thanh toán: <strong>{finalAmount.toLocaleString()}₫</strong></p>
      <div className="buttons">
        <button onClick={handleGoHome} className="btn-home">Về trang chủ</button>
        <button onClick={handleViewOrder} className="btn-order">Xem đơn hàng</button>
      </div>
    </div>
  );
};

export default CODPaymentPage;