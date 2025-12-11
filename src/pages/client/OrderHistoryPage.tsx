import { ShoppingBag } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderDetailsDialog from '../../components/Client/Order/OrderDetailsDialog';
import OrderHistoryErrorBoundary from '../../components/Client/Order/OrderHistoryErrorBoundary';
import OrderListItem from '../../components/Client/Order/OrderListItem';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/OrderHistory.css';
import { Order } from '../../types/Order';

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

      setOrders(data.map(order => {
        let paymentStatus = order.paymentStatus || 'unpaid';
        // Logic suy luận paymentStatus từ status đơn hàng
        if (order.status === 'paid') {
          paymentStatus = 'paid';
        } else if (order.paymentMethod === 'seepay' && ['processing', 'shipped', 'delivered', 'confirmed'].includes(order.status)) {
          paymentStatus = 'paid';
        } else if (['cod', 'cash-on-delivery'].includes(order.paymentMethod) && order.status === 'delivered') {
          paymentStatus = 'paid';
        }

        return {
          ...order,
          paymentStatus
        };
      }));
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

  return (
    <OrderHistoryErrorBoundary>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
        <Typography variant="h5" gutterBottom fontWeight="700" sx={{ mb: 3, color: '#333' }}>
          Lịch sử đơn hàng
        </Typography>

        <Paper className="order-tabs-paper" elevation={0} variant="outlined" sx={{ mb: 4, bgcolor: '#fdfdfd', borderRadius: 2 }}>
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

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : orders.length === 0 ? (
          <Box textAlign="center" py={8} bgcolor="#fff" borderRadius={2} border="1px dashed #ddd">
            <ShoppingBag sx={{ fontSize: 60, color: '#eee', mb: 2 }} />
            <Typography color="text.secondary" variant="body1">Chưa có đơn hàng nào ở trạng thái này.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Mua sắm ngay</Button>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {currentOrders.map((order) => (
              <OrderListItem
                key={order.id}
                order={order}
                onViewDetails={setSelectedOrder}
              />
            ))}
          </Stack>
        )}

        {/* Pagination Control - Hide if loading or empty */}
        {!loading && !error && orders.length > ITEMS_PER_PAGE && (
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