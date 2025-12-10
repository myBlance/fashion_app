import {
  AccessTime,
  CalendarToday,
  Cancel,
  CheckCircle,
  Info,
  LocalShipping,
  LocationOn,
  Payment,
  Phone,
  ReceiptLong,
  ShoppingBag, Visibility
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card, CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Pagination,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductRating } from '../../components/Client/Review/ProductRating';
import { useToast } from '../../contexts/ToastContext';

// --- Interfaces ---
interface Product {
  _id: string;
  code: string;
  name: string;
  image?: string;
  price: number;
}

interface ProductInOrder {
  product: Product | null;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  user: string;
  products: ProductInOrder[];
  totalPrice: number;
  status: 'pending' | 'awaiting_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid';
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
  };
  createdAt: string;
}

// --- Helpers ---
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending': return { label: 'Chờ xác nhận', color: 'warning', icon: <AccessTime />, hex: '#ed6c02', bg: '#fff7ed' };
    case 'awaiting_payment': return { label: 'Chờ thanh toán', color: 'warning', icon: <Payment />, hex: '#ff9800', bg: '#fff3e0' };
    case 'paid': return { label: 'Đã thanh toán', color: 'info', icon: <Payment />, hex: '#0288d1', bg: '#e1f5fe' };
    case 'processing': return { label: 'Đang xử lý', color: 'info', icon: <Info />, hex: '#0288d1', bg: '#e1f5fe' };
    case 'shipped': return { label: 'Đang giao', color: 'primary', icon: <LocalShipping />, hex: '#1976d2', bg: '#e3f2fd' };
    case 'delivered': return { label: 'Đã giao', color: 'success', icon: <CheckCircle />, hex: '#2e7d32', bg: '#e8f5e9' };
    case 'cancelled': return { label: 'Đã hủy', color: 'error', icon: <Cancel />, hex: '#d32f2f', bg: '#ffebee' };
    default: return { label: status, color: 'default', icon: undefined, hex: '#757575', bg: '#f5f5f5' };
  };
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

// --- Error Boundary ---
class OrderHistoryErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('OrderHistoryPage Error:', error, info); }
  render() {
    if (this.state.hasError) return <Alert severity="error">Đã xảy ra lỗi khi hiển thị lịch sử đơn hàng.</Alert>;
    return this.props.children;
  }
}

// --- Components ---

// 1. Product Item (Inside Dialog)
const ProductItem: React.FC<{ item: ProductInOrder; orderId: string; orderStatus: string }> = ({ item, orderId, orderStatus }) => {
  const product = item.product;

  if (!product) {
    return (
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
        <Typography variant="body2" color="error">Sản phẩm không tồn tại hoặc đã bị xóa</Typography>
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ mb: 2, display: 'flex', p: 1.5, alignItems: 'center', border: 'none', bgcolor: '#fafafa' }}>
      <Avatar
        src={product.image}
        variant="rounded"
        sx={{ width: 60, height: 60, mr: 2, bgcolor: '#fff', border: '1px solid #eee' }}
      >
        Img
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>{product.name}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">x{item.quantity}</Typography>
          {item.selectedColor && <Chip label={item.selectedColor} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />}
          {item.selectedSize && <Chip label={item.selectedSize} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />}
        </Stack>
        <Typography variant="body2" fontWeight="bold" color="primary" sx={{ mt: 0.5 }}>
          {formatCurrency(product.price)}
        </Typography>
      </Box>

      {orderStatus === 'delivered' && (
        <Box sx={{ minWidth: 120 }}>
          <ProductRating
            item={item}
            orderId={orderId}
            productId={item.product?.code || item.product?._id || ''}
          />
        </Box>
      )}
    </Card>
  );
};

// 2. Order Details Dialog (ĐÃ BỎ GRID)
const OrderDetailsDialog: React.FC<{
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onCancel: (order: Order) => void;
  onMarkDelivered: (order: Order) => void;
  cancelLoading: boolean;
  markDeliveredLoading: boolean;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ order, open, onClose, onCancel, onMarkDelivered, cancelLoading, markDeliveredLoading, navigate }) => {
  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);

  const canCancel = order.paymentMethod === 'cod'
    ? ['pending', 'paid', 'awaiting_payment'].includes(order.status)
    : ['pending', 'awaiting_payment'].includes(order.status) && order.paymentStatus === 'unpaid';
  const canMarkDelivered = order.status === 'shipped';
  const canRetryPayment = order.paymentStatus === 'unpaid' && order.paymentMethod === 'seepay' && ['pending', 'awaiting_payment'].includes(order.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', pb: 2 }}>
        <Stack>
          <Typography variant="h6" fontWeight="bold">Đơn hàng #{order.id}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{formatDate(order.createdAt)}</Typography>
          </Stack>
        </Stack>
        <Chip label={statusConfig.label} sx={{ bgcolor: statusConfig.bg, color: statusConfig.hex, fontWeight: 600 }} icon={statusConfig.icon} />
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* LAYOUT FLEX THAY CHO GRID */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>

          {/* Cột Trái: Thông tin (Chiếm 60% trên desktop) */}
          <Box flex={{ xs: 1, md: 1.5 }}>
            {/* Vận chuyển */}
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom textTransform="uppercase" color="text.secondary" fontSize="0.75rem">
              Thông tin vận chuyển
            </Typography>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#fff', borderRadius: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight="bold">{order.shippingAddress.fullName}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone fontSize="small" color="action" sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{order.shippingAddress.phone}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LocationOn fontSize="small" color="action" sx={{ fontSize: 16, mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">{order.shippingAddress.addressLine}</Typography>
                </Stack>
              </Stack>
            </Paper>

            {/* Thanh toán */}
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom textTransform="uppercase" color="text.secondary" fontSize="0.75rem">
              Thanh toán
            </Typography>
            <Paper elevation={0} variant="outlined" sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Phương thức:</Typography>
                <Typography variant="body2" fontWeight="600">{order.paymentMethod.toUpperCase()}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
                <Typography variant="body2" sx={{ color: order.paymentStatus === 'paid' ? 'success.main' : 'warning.main', fontWeight: 'bold' }}>
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" fontWeight="bold">Tổng cộng:</Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">{formatCurrency(order.totalPrice)}</Typography>
              </Stack>
            </Paper>
          </Box>

          {/* Cột Phải: Sản phẩm (Chiếm 40% trên desktop) */}
          <Box flex={{ xs: 1, md: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom textTransform="uppercase" color="text.secondary" fontSize="0.75rem">
              Sản phẩm ({order.products.length})
            </Typography>
            <Box sx={{ maxHeight: 450, overflowY: 'auto', pr: 1 }}>
              {order.products.map((item, idx) => (
                <ProductItem key={idx} item={item} orderId={order.id} orderStatus={order.status} />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: '#f5f5f5' }}>
        {canRetryPayment && (
          <Button variant="contained" color="secondary" onClick={() => { onClose(); navigate('/payment/seepay', { state: { orderId: order.id } }); }}>
            Thanh toán lại
          </Button>
        )}
        {canMarkDelivered && (
          <Button variant="contained" color="success" onClick={() => onMarkDelivered(order)} disabled={markDeliveredLoading}>
            {markDeliveredLoading ? 'Đang xử lý...' : 'Đã nhận hàng'}
          </Button>
        )}
        {canCancel && (
          <Button variant="outlined" color="error" onClick={() => onCancel(order)} disabled={cancelLoading}>
            {cancelLoading ? 'Đang hủy...' : 'Hủy đơn hàng'}
          </Button>
        )}
        <Button onClick={onClose} color="inherit" variant="text">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

// --- Main Page ---
const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { showToast } = useToast();

  // Pagination State
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Modal Actions State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [markDeliveredLoading, setMarkDeliveredLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    setError(null);
    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;
      if (selectedStatus !== 'all') url += `?status=${selectedStatus}`;

      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = Array.isArray(res.data) ? res.data.reverse() : [];

      setOrders(data.map(order => ({
        ...order,
        paymentStatus: order.paymentStatus || 'unpaid'
      })));
      setPage(1);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [selectedStatus]);

  // Actions Handlers
  const handleMarkDelivered = async (order: Order) => {
    if (!token) return;
    if (!window.confirm('Bạn xác nhận đã nhận được hàng?')) return;

    setMarkDeliveredLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${order.id}/mark-delivered`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Cập nhật thành công!', 'success');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Lỗi cập nhật.', 'error');
    } finally {
      setMarkDeliveredLoading(false);
    }
  };

  const handleCancelOrder = async (order: Order) => {
    if (!token) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    setCancelLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${order.id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showToast('Đơn hàng đã được hủy.', 'success');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Lỗi hủy đơn.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexOfLastOrder = page * ITEMS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ITEMS_PER_PAGE;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const statusTabs = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'awaiting_payment', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 5 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <OrderHistoryErrorBoundary>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
        <Typography variant="h5" gutterBottom fontWeight="700" sx={{ mb: 3, color: '#333' }}>
          Lịch sử đơn hàng
        </Typography>

        <Paper elevation={0} variant="outlined" sx={{ mb: 4, bgcolor: '#fdfdfd', borderRadius: 2 }}>
          <Tabs
            value={selectedStatus}
            onChange={(_, val) => setSelectedStatus(val)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.95rem', minHeight: 56 } }}
          >
            {statusTabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Paper>

        {orders.length === 0 ? (
          <Box textAlign="center" py={8} bgcolor="#fff" borderRadius={2} border="1px dashed #ddd">
            <ShoppingBag sx={{ fontSize: 60, color: '#eee', mb: 2 }} />
            <Typography color="text.secondary" variant="body1">Chưa có đơn hàng nào ở trạng thái này.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Mua sắm ngay</Button>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {currentOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <Card
                  key={order.id}
                  elevation={0}
                  variant="outlined"
                  sx={{
                    borderLeft: `6px solid ${statusConfig.hex}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                    bgcolor: '#fff',
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    {/* ĐÃ BỎ GRID, DÙNG BOX FLEX */}
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={2}>

                      {/* Cột 1: Thông tin đơn hàng */}
                      <Box flex={1.5} width="100%">
                        <Stack spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ReceiptLong color="action" fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="bold">#{order.id}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CalendarToday color="action" sx={{ fontSize: 14 }} />
                            <Typography variant="body2" color="text.secondary">{formatDate(order.createdAt)}</Typography>
                          </Stack>
                        </Stack>
                      </Box>

                      {/* Cột 2: Giá tiền */}
                      <Box flex={1} width="100%" display="flex" flexDirection="column" alignItems={{ xs: 'flex-start', md: 'center' }}>
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>Tổng tiền</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">{formatCurrency(order.totalPrice)}</Typography>
                      </Box>

                      {/* Cột 3: Trạng thái & Nút bấm */}
                      <Box
                        flex={1.5}
                        width="100%"
                        display="flex"
                        flexDirection={{ xs: 'row', md: 'column' }}
                        alignItems={{ xs: 'center', md: 'flex-end' }}
                        justifyContent={{ xs: 'space-between', md: 'center' }}
                        gap={1}
                      >
                        <Chip
                          label={statusConfig.label}
                          icon={statusConfig.icon}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: statusConfig.bg,
                            color: statusConfig.hex,
                            border: '1px solid transparent',
                            borderColor: `${statusConfig.hex}30`
                          }}
                        />
                        {/* Nút Xem chi tiết đã sửa màu */}
                        <Button
                          variant="outlined"
                          color="primary"
                          endIcon={<Visibility />}
                          size="small"
                          onClick={() => setSelectedOrder(order)}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 20,
                            px: 3,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            borderWidth: 2,
                            '&:hover': { borderWidth: 2 }
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>

                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        {/* Pagination Control */}
        {orders.length > ITEMS_PER_PAGE && (
          <Box display="flex" justifyContent="center" mt={5}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="medium"
            />
          </Box>
        )}

        {/* Order Detail Dialog */}
        <OrderDetailsDialog
          open={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={handleCancelOrder}
          onMarkDelivered={handleMarkDelivered}
          cancelLoading={cancelLoading}
          markDeliveredLoading={markDeliveredLoading}
          navigate={navigate}
        />

      </Container>
    </OrderHistoryErrorBoundary>
  );
};

export default OrderHistoryPage;