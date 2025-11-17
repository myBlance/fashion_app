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

// ✅ Bỏ interface Address nếu không dùng

const SeepayPaymentPage: React.FC = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Thêm orderId vào destructuring
  const {
    orderId: existingOrderId, // ✅ Lấy orderId từ state, đổi tên để rõ ràng
    cartItems,
    totalAmount,
    shippingFee = 0,
    discountAmount = 0,
    selectedAddress,
    userId,
  } = location.state || {};

  // ✅ Tính finalAmount
  const finalAmount = totalAmount - (discountAmount || 0) + (shippingFee || 0);

  useEffect(() => {
    // ✅ Kiểm tra điều kiện ban đầu, có thể cần orderId hoặc cartItems tùy trường hợp
    // Nếu là thanh toán lại (có existingOrderId), có thể không cần cartItems, totalAmount, v.v. nữa
    // nhưng để giữ logic nhất quán, mình vẫn giữ kiểm tra.
    // Nếu là tạo mới (không có existingOrderId), thì cần các trường này.
    if (!existingOrderId && (!cartItems || cartItems.length === 0 || !userId)) {
      navigate('/checkout');
      return;
    }

    // ✅ Hàm để xử lý tạo đơn mới (giữ nguyên logic cũ)
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

    // ✅ Hàm để xử lý thanh toán lại đơn cũ
    const handleRetryPayment = async () => {
      // existingOrderId đã được kiểm tra ở trên useEffect
      if (!existingOrderId) {
        setError('Không tìm thấy ID đơn hàng cần thanh toán lại.');
        setIsLoading(false);
        return;
      }

      // ✅ Gọi API kiểm tra trạng thái thanh toán để lấy lại thông tin đơn hàng (nếu cần)
      // hoặc giả định rằng đơn hàng đã được reset đúng cách bởi backend
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status`,
          { orderId: existingOrderId }
        );

        // ✅ Kiểm tra xem đơn hàng có đúng là pending không
        if (res.data.status !== 'pending') {
          setError('Đơn hàng không ở trạng thái chờ thanh toán.');
          setIsLoading(false);
          return;
        }

        // ✅ Tạo đối tượng order giả lập từ dữ liệu đã có và kiểm tra API
        // Bạn có thể cần endpoint mới để lấy QR code cho đơn cũ nếu không dùng lại được
        // Ở đây, mình giả định QR code có thể được tạo lại dựa trên ID và số tiền
        const qrUrl = `https://img.vietqr.io/image/MB-0917436401-print.png?amount=${res.data.amount}&addInfo=${res.data.orderId}`;
        const orderResponse: OrderResponse = {
          orderId: res.data.orderId,
          qrUrl,
          status: res.data.status,
          amount: res.data.amount,
        };

        setOrder(orderResponse);
        setIsLoading(false);

        setupSocketAndPolling(orderResponse.orderId);

      } catch (err: any) {
        console.error("Lỗi khi chuẩn bị thanh toán lại:", err);
        setError(err.response?.data?.message || 'Không thể lấy thông tin đơn hàng để thanh toán lại. Vui lòng thử lại.');
        setIsLoading(false);
      }
    };

    // ✅ Hàm thiết lập Socket.IO và Polling (trích xuất từ createOrder)
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

      // ✅ Bắt đầu polling để kiểm tra thanh toán
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

      // ✅ Cleanup function
      return () => {
        socket.disconnect();
        clearInterval(interval);
      };
    };

    // ✅ Kiểm tra xem là tạo mới hay thanh toán lại
    if (existingOrderId) {
      // console.log("SeepayPayment: Đang xử lý thanh toán lại cho orderId:", existingOrderId);
      handleRetryPayment();
    } else {
      // console.log("SeepayPayment: Đang tạo đơn mới");
      createNewOrder();
    }

    // ✅ Cleanup function chính
    return () => {
      // Các cleanup khác nếu cần
    };
  }, [existingOrderId, cartItems, finalAmount, selectedAddress, userId]); // ✅ Thêm các deps cần thiết

  // useEffect để kiểm tra thanh toán (nếu cần, nhưng đã được xử lý trong setupSocketAndPolling)
  // useEffect(() => {
  //   if (order && !isPaid) {
  //     const interval = setInterval(async () => {
  //       try {
  //         const res = await axios.post(
  //           `${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status`,
  //           { orderId: order.orderId }
  //         );
  //         if (res.data.status === 'paid') {
  //           setIsPaid(true);
  //           clearInterval(interval);
  //         }
  //       } catch (err) {
  //         console.warn('Polling check failed:', err);
  //       }
  //     }, 3000);

  //     return () => clearInterval(interval);
  //   }
  // }, [order, isPaid]);

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="seepay-container">
        <div className="loader">Đang xử lý đơn hàng...</div> {/* ✅ Cập nhật text loader */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="seepay-container error">
        <h2>❌ Lỗi</h2>
        <p>{error}</p>
        <button onClick={handleGoHome}>Về trang chủ</button> {/* ✅ Cập nhật nút */}
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
          <button onClick={() => navigate('/order-history')} className="btn-cart">Xem lịch sử đơn hàng</button> {/* ✅ Cập nhật nút */}
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
        <p><strong>Số tiền:</strong> {order?.amount ? order.amount.toLocaleString() : finalAmount.toLocaleString()}₫</p> {/* ✅ Hiển thị số tiền từ order nếu có */}
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
      {/* ✅ Thêm nút "Về trang chủ" vào phần chính của giao diện QR */}
      <div className="payment-page-actions">
        <button onClick={handleGoHome} className="btn-home">Về trang chủ</button>
      </div>
    </div>
  );
};

export default SeepayPaymentPage;