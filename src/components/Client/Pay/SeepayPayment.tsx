// src/pages/client/SeepayPaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../../../styles/SeepayPayment.css';

interface OrderResponse {
  orderId: string;
  qrUrl: string;
  status: string;
  amount: number;
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

// ✅ Bỏ interface Address nếu không dùng

const SeepayPaymentPage: React.FC = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
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

        const res = await axios.post<OrderResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/create-order`,
          {
            name,
            amount: finalAmount,
            userId,
            products: cartItems.map((item: CartItem) => ({
              productId: item.productId,
              quantity: item.quantity,
              color: item.color,
              size: item.size,
            })),
            shippingAddress: {
              fullName: selectedAddress.name,
              phone: selectedAddress.phone,
              addressLine: selectedAddress.address,
            },
          }
        );

        setOrder(res.data);
        setIsLoading(false);

        const socket = io(import.meta.env.VITE_API_BASE_URL, {
          path: '/socket.io',
          transports: ['websocket'],
        });

        socket.on('connect', () => {
          socket.emit('join_order', res.data.orderId);
        });

        // ✅ Sửa lỗi dòng này
        socket.on('order_paid', ({ orderId }: { orderId: string }) => {
          if (orderId === res.data.orderId) {
            setIsPaid(true);
          }
        });

        return () => { socket.disconnect(); };
      } catch (err: any) {
        setError('Không thể tạo đơn. Vui lòng thử lại.');
        setIsLoading(false);
      }
    };

    createOrder();
  }, []);

  useEffect(() => {
    if (order && !isPaid) {
      const interval = setInterval(async () => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status`,
            { orderId: order.orderId }
          );
          if (res.data.status === 'paid') {
            setIsPaid(true);
            clearInterval(interval);
          }
        } catch (err) {
          console.warn('Polling check failed:', err);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [order, isPaid]);

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="seepay-container">
        <div className="loader">Đang tạo đơn thanh toán...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seepay-container error">
        <h2>❌ Lỗi</h2>
        <p>{error}</p>
        <button onClick={handleBackToCart}>Quay lại giỏ hàng</button>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="seepay-container success">
        <div className="success-icon">✅</div>
        <h2>Thanh toán thành công!</h2>
        <p>Đơn hàng <strong>{order?.orderId}</strong> đã được xác nhận.</p>
        <div className="buttons">
          <button onClick={handleGoHome} className="btn-home">Về trang chủ</button>
          <button onClick={handleBackToCart} className="btn-cart">Xem đơn hàng</button>
        </div>
      </div>
    );
  }

  return (
    <div className="seepay-container">
      <h2>Thanh toán bằng SeePay</h2>
      <p>Vui lòng quét mã QR bên dưới để thanh toán:</p>

      <div className="qr-section">
        {order?.qrUrl ? (
          <img
            src={order.qrUrl}
            alt="QR thanh toán SeePay"
            className="qr-code"
            onError={() => setError('Không tải được QR code')}
          />
        ) : (
          <div className="placeholder">Đang tải QR...</div>
        )}
      </div>

      <div className="order-info">
        <p><strong>Mã đơn:</strong> {order?.orderId}</p>
        <p><strong>Số tiền:</strong> {finalAmount.toLocaleString()}₫</p>
        <p className="note">
          🔔 Bạn có thể đóng cửa sổ này sau khi thanh toán thành công — hệ thống sẽ tự động xác nhận.
        </p>
      </div>

      <div className="manual-check">
        <button
          onClick={async () => {
            if (order?.orderId) {
              const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status`,
                { orderId: order.orderId }
              );
              if (res.data.status === 'paid') {
                setIsPaid(true);
              } else {
                alert('Chưa thanh toán. Vui lòng quét QR để tiếp tục.');
              }
            }
          }}
        >
          Kiểm tra lại
        </button>
      </div>
    </div>
  );
};

export default SeepayPaymentPage;