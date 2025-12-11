import { Alert } from '@mui/material';
import React, { Component } from 'react';

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

export default OrderHistoryErrorBoundary;
