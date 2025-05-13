import React from 'react';

import { Typography, Box, Paper } from '@mui/material';

const OrderPage: React.FC = () => {
  return (
    <div>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4">Quản lý Đơn hàng</Typography>
      </Box>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">Danh sách đơn hàng sẽ hiển thị ở đây.</Typography>
        {/* Có thể thêm bảng danh sách đơn hàng ở đây */}
      </Paper>
    </div>
  );
};

export default OrderPage;
