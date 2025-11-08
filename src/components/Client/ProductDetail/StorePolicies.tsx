import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StorePolicies: React.FC = () => {
  const theme = useTheme();

  const policies = [
    'Miễn phí vận chuyển cho đơn hàng trên 500.000đ',
    'Đổi trả trong 7 ngày nếu sản phẩm lỗi',
    'Hỗ trợ đổi size/màu trong vòng 3 ngày',
    'Thanh toán khi nhận hàng (COD)',
    'Bảo mật thông tin khách hàng',
    'Cam kết hàng chính hãng 100%',
    'Hỗ trợ đổi trả trong 30 ngày cho sản phẩm chưa sử dụng',
  ];

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Chính Sách & Ưu Đãi
      </Typography>
      <Typography variant="body1" paragraph color="textSecondary" mb={2}>
        Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm an toàn, nhanh chóng và hài lòng nhất.
      </Typography>

      <Paper elevation={2} sx={{ p: 2 }}>
        <List>
          {policies.map((policy, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 30, mt: 0.5 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {policy}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box mt={3} p={2} sx={{ bgcolor: theme.palette.grey[100], borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>Lưu ý:</strong> Các chính sách có thể được cập nhật theo thời gian. Vui lòng kiểm tra lại 
          thông tin mới nhất tại thời điểm mua hàng.
        </Typography>
      </Box>
    </Box>
  );
};

export default StorePolicies;