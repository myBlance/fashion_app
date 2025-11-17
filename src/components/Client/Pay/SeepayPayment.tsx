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

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
}

const SeepayPaymentPage: React.FC = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    orderId: existingOrderId,
    cartItems,
    totalAmount,
    shippingFee = 0,
    discountAmount = 0,
    selectedAddress,
    userId,
  } = location.state || {};

  const finalAmount = totalAmount - (discountAmount || 0) + (shippingFee || 0);

  useEffect(() => {
    if (!existingOrderId && (!cartItems || cartItems.length === 0 || !userId)) {
      navigate('/checkout');
      return;
    }

    const createNewOrder = async () => {
      if (!cartItems || cartItems.length === 0 || !userId || !selectedAddress) {
        setError('Dữ liệu đơn hàng không đầy đủ.');
        setIsLoading(false);
        return;
      }
      try {
        const name = selectedAddress.name || 'Khách hàng';

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
        setupSocketAndPolling(res.data.orderId);
      } catch (err: any) {
        console.error("Lỗi khi tạo đơn mới:", err);
        setError(err.response?.data?.message || 'Không thể tạo đơn. Vui lòng thử lại.');
        setIsLoading(false);
      }
    };

    // ✅ Sửa hàm handleRetryPayment để dùng endpoint mới
    const handleRetryPayment = async () => {
      if (!existingOrderId) {
        setError('Không tìm thấy ID đơn hàng cần thanh toán lại.');
        setIsLoading(false);
        return;
      }

      try {
        // ✅ Gọi API mới để lấy QR
        const res = await axios.get<OrderResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/api/orders/${existingOrderId}/seepay-qr`
        );

        setOrder(res.data);
        setIsLoading(false);
        setupSocketAndPolling(res.data.orderId);

      } catch (err: any) {
        console.error("Lỗi khi lấy QR cho thanh toán lại:", err);
        setError(err.response?.data?.message || 'Không thể lấy QR để thanh toán lại. Vui lòng thử lại.');
        setIsLoading(false);
      }
    };

    const setupSocketAndPolling = (orderId: string) => {
      const socket = io(import.meta.env.VITE_API_BASE_URL, {
        path: '/socket.io',
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        socket.emit('join_order', orderId);
      });

      socket.on('order_paid', ({ orderId: paidOrderId }: { orderId: string }) => {
        if (paidOrderId === orderId) {
          setIsPaid(true);
        }
      });

      const interval = setInterval(async () => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status`,
            { orderId }
          );
          if (res.data.status === 'paid') {
            setIsPaid(true);
            clearInterval(interval);
          }
        } catch (err) {
          console.warn('Polling check failed:', err);
        }
      }, 3000);

      return () => {
        socket.disconnect();
        clearInterval(interval);
      };
    };

    if (existingOrderId) {
      handleRetryPayment();
    } else {
      createNewOrder();
    }

    return () => {
      // Cleanup
    };
  }, [existingOrderId, cartItems, finalAmount, selectedAddress, userId]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="seepay-container">
        <div className="loader">Đang xử lý đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seepay-container error">
        <h2>❌ Lỗi</h2>
        <p>{error}</p>
        <button onClick={handleGoHome}>Về trang chủ</button>
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
          <button onClick={() => navigate('/order-history')} className="btn-cart">Xem lịch sử đơn hàng</button>
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
        <p><strong>Số tiền:</strong> {order?.amount ? order.amount.toLocaleString() : finalAmount.toLocaleString()}₫</p>
        <p className="note">
          🔔 Bạn có thể đóng cửa sổ này sau khi thanh toán thành công — hệ thống sẽ tự động xác nhận.
        </p>
      </div>

      <div className="manual-check">
        <button
          onClick={async () => {
            if (order?.orderId) {
              try {
                const res = await axios.post(
                  `${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status`,
                  { orderId: order.orderId }
                );
                if (res.data.status === 'paid') {
                  setIsPaid(true);
                } else {
                  alert('Chưa thanh toán. Vui lòng quét QR để tiếp tục.');
                }
              } catch (err) {
                console.error("Lỗi khi kiểm tra lại:", err);
                alert('Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
              }
            }
          }}
        >
          Kiểm tra lại
        </button>
      </div>

      <div className="payment-page-actions">
        <button onClick={handleGoHome} className="btn-home">Về trang chủ</button>
      </div>
    </div>
  );
};

export default SeepayPaymentPage;