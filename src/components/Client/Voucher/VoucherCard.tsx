// src/components/Client/Voucher/VoucherCard.tsx
import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

interface VoucherCardProps {
  code: string;
  discountText: string;
  conditionText: string;
  isFreeShip?: boolean;
  shopName: string;
  minOrderValue: number;
  expiryDate: string;
  currentTotalAmount?: number; // ✅ Sửa thành optional
  onCopy: () => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  code,
  discountText,
  conditionText,
  isFreeShip = false,
  shopName,
  minOrderValue,
  expiryDate,
  currentTotalAmount, // ✅ Nhận vào, có thể là undefined
  onCopy,
}) => {
  // ✅ Kiểm tra nếu có totalAmount thì mới so sánh
  const isEligible = currentTotalAmount !== undefined ? currentTotalAmount >= minOrderValue : true;

  return (
    <Box
      sx={{
        width: 300,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        },
        cursor: 'pointer',
        border: isEligible ? '1px solid #e0e0e0' : '1px dashed #f44336',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: isFreeShip
            ? 'linear-gradient(90deg, #ff9800, #ffb74d)'
            : 'linear-gradient(90deg, #d32f2f, #f44336)',
          color: 'white',
          py: 1.2,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 18,
          letterSpacing: 1,
          borderBottom: '2px dashed rgba(255,255,255,0.3)',
        }}
      >
        🎟 {code}
      </Box>

      {/* Nội dung chính */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: isEligible ? '#d32f2f' : '#9e9e9e', mb: 0.5 }}
          >
            {discountText}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {conditionText}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Shop: {shopName}
          </Typography>
        </Box>

        {isFreeShip && (
          <Box
            sx={{
              backgroundColor: '#ffeb3b',
              color: '#333',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontWeight: 600,
            }}
          >
            <DirectionsCarIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">Miễn phí</Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 1.5,
          borderTop: '1px dashed #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Box>
          <Chip
            icon={<LocalOfferIcon />}
            label={isEligible ? 'Có thể áp dụng' : 'Không đủ điều kiện'}
            size="small"
            sx={{
              backgroundColor: isEligible ? '#e8f5e9' : '#ffebee',
              color: isEligible ? '#2e7d32' : '#c62828',
              fontWeight: 'bold',
              mb: 0.5,
            }}
          />
          <Typography variant="caption" display="block">
            Đơn tối thiểu: {minOrderValue.toLocaleString()}đ
          </Typography>
          <Typography variant="caption" display="block">
            HSD: {expiryDate}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={onCopy}
          disabled={currentTotalAmount !== undefined && !isEligible} // ✅ Vô hiệu hóa nếu có totalAmount và không đủ điều kiện
          sx={{
            background: isEligible
              ? 'linear-gradient(90deg, #ff9800, #f57c00)'
              : '#bdbdbd',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 'bold',
            px: 2.5,
            borderRadius: 2,
            '&:hover': {
              background: isEligible
                ? 'linear-gradient(90deg, #f57c00, #ef6c00)'
                : '#bdbdbd',
            },
          }}
        >
          {isEligible ? 'Sao chép' : 'Không thể dùng'}
        </Button>
      </Box>
    </Box>
  );
};

export default VoucherCard;