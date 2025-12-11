import { CalendarToday, LocationOn, Phone } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../../types/Order';
import { formatCurrency, formatDate, getStatusConfig } from '../../../utils/orderHelpers';
import ProductItem from './ProductItem';

interface OrderDetailsDialogProps {
    order: Order | null;
    open: boolean;
    onClose: () => void;
    onCancel: (order: Order) => void;
    onMarkDelivered: (order: Order) => void;
    cancelLoading: boolean;
    markDeliveredLoading: boolean;
    navigate: ReturnType<typeof useNavigate>;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
    order,
    open,
    onClose,
    onCancel,
    onMarkDelivered,
    cancelLoading,
    markDeliveredLoading,
    navigate
}) => {
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
                                    {order.paymentStatus === 'paid' ? 'Đã thanh toán' : (['cod', 'cash-on-delivery'].includes(order.paymentMethod) ? 'Thanh toán khi nhận hàng' : 'Chưa thanh toán')}
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

export default OrderDetailsDialog;
