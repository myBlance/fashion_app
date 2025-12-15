// src/pages/client/SeepayPaymentPage.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useToast } from '../../../contexts/ToastContext';
import '../../../styles/SeepayPayment.css';
import { CartItem } from '../../../types/CartItem';

interface OrderResponse {
  orderId: string;
  qrUrl: string;
  status: string;
  amount: number;
}


const SeepayPaymentPage: React.FC = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

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
            voucherCode: location.state?.selectedVoucher?.code,
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

    // Sửa hàm handleRetryPayment để dùng endpoint mới
    const handleRetryPayment = async () => {
      if (!existingOrderId) {
        setError('Không tìm thấy ID đơn hàng cần thanh toán lại.');
        setIsLoading(false);
        return;
      }

      try {
        // Gọi API mới để lấy QR
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
      <div className="seepay-page-wrapper">
        <div className="seepay-container">
          <div className="loader-wrapper">
            <div className="spinner"></div>
            <p>Đang xử lý đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seepay-page-wrapper">
        <div className="seepay-container error">
          <h2>❌ Lỗi Thanh Toán</h2>
          <p>{error}</p>
          <div className="buttons">
            <button onClick={handleGoHome} className="btn-secondary">Về trang chủ</button>
          </div>
        </div>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="seepay-page-wrapper">
        <div className="seepay-container success">
          <div className="success-icon-wrapper">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2>Thanh toán thành công!</h2>
          <p>Đơn hàng của bạn đã được xác nhận.</p>

          <div className="order-details-card">
            <div className="detail-row">
              <span className="label">Mã đơn hàng</span>
              <span className="value">#{order?.orderId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Tổng thanh toán</span>
              <span className="value">{(order?.amount || finalAmount).toLocaleString()}₫</span>
            </div>
          </div>

          <div className="buttons">
            <button onClick={() => navigate('/orders')} className="btn-primary">
              Xem lịch sử đơn hàng
            </button>
            <button onClick={handleGoHome} className="btn-secondary">
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seepay-page-wrapper">
      <div className="seepay-container">
        <h2>Thanh toán bằng SeePay</h2>
        <p>Vui lòng quét mã QR bên dưới để thanh toán</p>

        <div className="qr-section">
          {order?.qrUrl ? (
            <img
              src={order.qrUrl}
              alt="QR thanh toán SeePay"
              className="qr-code"
              onError={() => setError('Không tải được QR code')}
            />
          ) : (
            <div className="loader-wrapper" style={{ minHeight: '220px' }}>
              <div className="spinner"></div>
              <p style={{ fontSize: '0.9rem' }}>Đang tải QR...</p>
            </div>
          )}
        </div>

        <div className="order-details-card">
          <div className="detail-row">
            <span className="label">Mã đơn hàng</span>
            <span className="value">{order?.orderId}</span>
          </div>
          <div className="detail-row">
            <span className="label">Số tiền</span>
            <span className="value">{order?.amount ? order.amount.toLocaleString() : finalAmount.toLocaleString()}₫</span>
          </div>
        </div>

        <p className="note">
          🔔 Bạn có thể đóng cửa sổ sau khi thanh toán, hệ thống sẽ tự động xác nhận.
        </p>

        <div className="buttons">
          <button
            className="btn-primary"
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
                    showToast('Chưa nhận được thanh toán. Vui lòng thử lại.', 'info');
                  }
                } catch (err) {
                  console.error("Lỗi khi kiểm tra:", err);
                  showToast('Lỗi kiểm tra trạng thái.', 'error');
                }
              }
            }}
          >
            Tôi đã thanh toán
          </button>

          <button onClick={handleGoHome} className="btn-secondary">
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeepayPaymentPage;