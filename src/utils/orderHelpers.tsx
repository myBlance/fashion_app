import {
    AccessTime,
    Cancel,
    CheckCircle,
    Info,
    LocalShipping,
    Payment
} from '@mui/icons-material';

export const getStatusConfig = (status: string) => {
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

export const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
};
