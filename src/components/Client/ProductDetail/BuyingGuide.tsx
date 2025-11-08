import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import LockIcon from '@mui/icons-material/Lock';

const BuyingGuide: React.FC = () => {

  const steps = [
    {
      icon: <ShoppingCartIcon color="primary" />,
      title: 'Chọn sản phẩm',
      description: 'Duyệt và chọn sản phẩm bạn muốn mua. Chọn màu sắc, kích thước phù hợp.',
    },
    {
      icon: <LocalShippingIcon color="primary" />,
      title: 'Kiểm tra giỏ hàng',
      description: 'Xem lại sản phẩm đã chọn, số lượng, giá cả và thông tin giao hàng.',
    },
    {
      icon: <PaymentIcon color="primary" />,
      title: 'Thanh toán',
      description: 'Chọn phương thức thanh toán phù hợp: Thẻ, ví điện tử, hoặc thanh toán khi nhận hàng (COD).',
    },
    {
      icon: <LockIcon color="primary" />,
      title: 'Xác nhận đơn hàng',
      description: 'Nhập thông tin giao hàng chính xác và xác nhận đơn hàng.',
    },
    {
      icon: <CheckCircleIcon color="primary" />,
      title: 'Theo dõi đơn hàng',
      description: 'Sau khi đặt hàng, bạn có thể theo dõi trạng thái đơn hàng trong phần tài khoản.',
    },
  ];

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Hướng Dẫn Mua Hàng
      </Typography>
      <Typography variant="body1" paragraph color="textSecondary" mb={3}>
        Mua sắm tại cửa hàng của chúng tôi thật dễ dàng và nhanh chóng. Dưới đây là các bước để bạn hoàn tất đơn hàng:
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <List>
          {steps.map((step, index) => (
            <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                {step.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    Bước {index + 1}: {step.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {step.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

    </Box>
  );
};

export default BuyingGuide;