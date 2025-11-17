import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, Tab, Box, Divider } from '@mui/material';
import '../../styles/OrderHistory.css';
import { ProductRating } from '../../components/Client/Review/ProductRating'; // ✅ Import component mới

// --- Interfaces ---
interface Product {
  _id: string; // ✅ ID MongoDB
  code: string; // ✅ mã sản phẩm duy nhất, ví dụ "DOLA3901"
  name: string;
  image?: string;
  price: number;
}

interface ProductInOrder {
  product: Product | null;
  productId: string; // ✅ thêm productId để đồng nhất với backend (được dùng khi gửi review)
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  user: string;
  products: ProductInOrder[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid';
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
  };
  createdAt: string;
}

// ✅ Hàm chuyển đổi trạng thái
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Chờ xác nhận';
    case 'paid': return 'Đã thanh toán';
    case 'processing': return 'Đang xử lý';
    case 'shipped': return 'Đang giao';
    case 'delivered': return 'Đã giao';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

// --- Error Boundary ---
class OrderHistoryErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('OrderHistoryPage caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          Đã xảy ra lỗi khi hiển thị trang lịch sử đơn hàng.
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Product Item ---
// Trước: { item, orderId }
const ProductItem: React.FC<{ item: ProductInOrder; orderId: string; orderStatus: string }> = ({ item, orderId, orderStatus }) => {
  const product = item.product;

  if (!product) {
    return (
      <div className="product-item">
        <div className="product-info">
          <p><strong>Sản phẩm không tồn tại hoặc đã bị xóa</strong></p>
          <p>Giá: N/A</p>
          <p>Số lượng: {item.quantity}</p>
          {item.selectedColor && <p>Màu: {item.selectedColor}</p>}
          {item.selectedSize && <p>Kích cỡ: {item.selectedSize}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="product-item">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div className="product-info">
        <p><strong>{product.name}</strong></p>
        <p>Giá: {product.price?.toLocaleString()}₫</p>
        <p>Số lượng: {item.quantity}</p>
        {item.selectedColor && <p>Màu: {item.selectedColor}</p>}
        {item.selectedSize && <p>Kích cỡ: {item.selectedSize}</p>}
      </div>

      {/* Sửa: sử dụng orderStatus và orderId từ props */}
      {orderStatus === 'delivered' && (
        <div className="product-rating-section">
          <ProductRating 
  item={item} 
  orderId={orderId} 
    productId={item.product?.code || item.product?._id || ''} // ✅ Truyền mã sản phẩm
/>
        </div>
      )}
    </div>
  );
};


// --- Order Item ---
const OrderItem: React.FC<{ order: Order; onClick: () => void }> = ({ order, onClick }) => (
  <div key={order.id} className="order-item">
    <div className="order-header">
      <div className="order-info">
        <p><strong>Mã đơn:</strong> {order.id}</p>
        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Trạng thái:</strong> <span className={`status-${order.status}`}>{getStatusLabel(order.status)}</span></p>
        <p><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}₫</p>
      </div>
      <button className="view-details-btn" onClick={onClick}>
        Xem chi tiết
      </button>
    </div>
  </div>
);

// --- Modal Content ---
const ModalContent: React.FC<{
  order: Order;
  onClose: () => void;
  onCancel: (order: Order) => void;
  onMarkDelivered: (order: Order) => void;
  cancelLoading: boolean;
  cancelError: string | null;
  markDeliveredLoading: boolean;
  markDeliveredError: string | null;
}> = ({ order, onClose, onCancel, onMarkDelivered, cancelLoading, cancelError, markDeliveredLoading, markDeliveredError }) => {
  const canCancel = order.paymentMethod === 'cod'
    ? ['pending', 'paid'].includes(order.status)
    : order.status === 'pending' && order.paymentStatus === 'unpaid';

  const canMarkDelivered = order.status === 'shipped';
  const canRate = order.status === 'delivered';

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Chi tiết đơn hàng: {order.id}</h3>
      <div className="order-details">
        <div className="products-list">
          <h4>Sản phẩm trong đơn:</h4>
          {order.products.map((item, idx) => (
            <div key={idx}>
              <ProductItem item={item} orderId={order.id} orderStatus={order.status} />
      {canRate && <Divider sx={{ my: 1 }} />}
              {canRate && <Divider sx={{ my: 1 }} />} {/* Thêm line giữa các sản phẩm nếu có đánh giá */}
            </div>
          ))}
        </div>

        <div className="shipping-info">
          <h4>Thông tin giao hàng:</h4>
          <p><strong>Người nhận:</strong> {order.shippingAddress.fullName}</p>
          <p><strong>Số điện thoại:</strong> {order.shippingAddress.phone}</p>
          <p><strong>Địa chỉ:</strong> {order.shippingAddress.addressLine}</p>
        </div>

        <div className="order-summary">
          <p><strong>Trạng thái:</strong> <span className={`status-${order.status}`}>{getStatusLabel(order.status)}</span></p>
          <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
          <p><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}₫</p>
        </div>
      </div>

      <div className="modal-actions">
        {/* Nút đánh dấu đã nhận hàng */}
        {canMarkDelivered && (
          <div className="mark-delivered-section">
            {markDeliveredError && <p className="error-message">{markDeliveredError}</p>}
            <button
              className="mark-delivered-btn"
              onClick={() => onMarkDelivered(order)}
              disabled={markDeliveredLoading}
            >
              {markDeliveredLoading ? 'Đang cập nhật...' : 'Đã nhận hàng'}
            </button>
          </div>
        )}

        {/* Nút hủy đơn */}
        {canCancel && (
          <div className="cancel-section">
            {cancelError && <p className="error-message">{cancelError}</p>}
            <button
              className="cancel-order-btn"
              onClick={() => onCancel(order)}
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Đang hủy...' : 'Hủy đơn hàng'}
            </button>
          </div>
        )}

        {/* Thông báo nếu không thể thực hiện hành động */}
        {!canCancel && !canMarkDelivered && (
          <div className="no-action-section">
            <p>Không thể thực hiện hành động ở trạng thái này.</p>
          </div>
        )}
      </div>

      <button className="close-modal-btn" onClick={onClose}>
        Đóng
      </button>
    </div>
  );
};

// --- Main Component ---
const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [markDeliveredLoading, setMarkDeliveredLoading] = useState(false);
  const [markDeliveredError, setMarkDeliveredError] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;
      if (selectedStatus !== 'all') url += `?status=${selectedStatus}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersWithDefaultPaymentStatus = Array.isArray(res.data)
        ? res.data.map(order => ({
          ...order,
          paymentStatus: order.paymentStatus || 'unpaid'
        }))
        : [];

      setOrders(ordersWithDefaultPaymentStatus);
    } catch (err: any) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setCancelError(null);
    setMarkDeliveredError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setCancelError(null);
    setMarkDeliveredError(null);
  };

  const markOrderAsDelivered = async (order: Order) => {
    if (!token) return;

    setMarkDeliveredLoading(true);
    setMarkDeliveredError(null);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${order.id}/mark-delivered`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert('Đơn hàng đã được đánh dấu là đã nhận.');
        await fetchOrders();
        closeModal();
      }
    } catch (err: any) {
      console.error('Lỗi khi đánh dấu đơn hàng đã nhận:', err);
      setMarkDeliveredError(err.response?.data?.message || 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setMarkDeliveredLoading(false);
    }
  };

  const checkPaymentAndCancel = async (order: Order) => {
    if (!token) return;

    if (order.paymentMethod === 'cod') {
      if (['pending', 'paid'].includes(order.status)) {
        await performCancel(order);
      } else {
        setCancelError('Không thể hủy đơn ở trạng thái này.');
      }
      return;
    }

    setCancelLoading(true);
    setCancelError(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/check-payment-status`,
        { orderId: order.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === 'paid') {
        setCancelError('Đơn hàng đã được thanh toán, không thể hủy.');
      } else {
        await performCancel(order);
      }
    } catch (err: any) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', err);
      setCancelError('Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
    } finally {
      setCancelLoading(false);
    }
  };

  const performCancel = async (order: Order) => {
    if (!token) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${order.id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert('Đơn hàng đã được hủy.');
        await fetchOrders();
        closeModal();
      }
    } catch (err: any) {
      console.error('Lỗi khi hủy đơn:', err);
      setCancelError(err.response?.data?.message || 'Không thể hủy đơn. Vui lòng thử lại.');
    }
  };

  const statusTabs = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  if (loading) {
    return (
      <OrderHistoryErrorBoundary>
        <div className="order-history-container">
          <div className="loader">Đang tải đơn hàng...</div>
        </div>
      </OrderHistoryErrorBoundary>
    );
  }

  if (error) {
    return (
      <OrderHistoryErrorBoundary>
        <div className="order-history-container error">
          <h2>❌ Lỗi</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
      </OrderHistoryErrorBoundary>
    );
  }

  return (
    <OrderHistoryErrorBoundary>
      <div className="order-history-container">
        <h2>Lịch sử đơn hàng</h2>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedStatus}
            onChange={(e, newValue) => setSelectedStatus(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {statusTabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>

        {orders.length === 0 ? (
          <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} onClick={() => openModal(order)} />
            ))}
          </div>
        )}

        {isModalOpen && selectedOrder && (
          <div className="modal-overlay" onClick={closeModal}>
            <ModalContent
              order={selectedOrder}
              onClose={closeModal}
              onCancel={checkPaymentAndCancel}
              onMarkDelivered={markOrderAsDelivered}
              cancelLoading={cancelLoading}
              cancelError={cancelError}
              markDeliveredLoading={markDeliveredLoading}
              markDeliveredError={markDeliveredError}
            />
          </div>
        )}
      </div>
    </OrderHistoryErrorBoundary>
  );
};

export default OrderHistoryPage;