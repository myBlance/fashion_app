// src/components/Client/Voucher/VoucherCard.tsx
import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export interface VoucherCardProps {
  _id: string;
  code: string;
  name?: string;
  description?: string;
  type?: 'fixed' | 'percentage';
  value?: number;
  shopName?: string;
  validFrom?: string;
  validUntil?: string;
  minOrderAmount?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  isActive?: boolean;

  discountText?: string;
  conditionText?: string;
  isFreeShip?: boolean;

  currentTotalAmount?: number;
  onCopy: () => void;
  onClaim?: (code: string) => void;
  isClaimed?: boolean; // ✅ Thêm prop mới
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  code,
  name,
  type,
  value,
  validFrom,
  validUntil,
  minOrderAmount = 0,
  maxUses,
  maxUsesPerUser,
  isActive = true,
  discountText,
  isFreeShip = false,
  currentTotalAmount,
  onCopy,
  onClaim,
  isClaimed = false, // ✅ Mặc định là chưa lưu
}) => {
  const isEligible =
    currentTotalAmount !== undefined ? currentTotalAmount >= minOrderAmount && isActive : isActive;

  const handleClaim = () => {
    if (onClaim && !isClaimed) {
      onClaim(code);
    }
  };

  // ✅ Tính toán discountText nếu không có
  const displayDiscountText = discountText || (type && value !== undefined
    ? type === 'percentage'
      ? `Giảm ${value}%`
      : `Giảm ${value.toLocaleString()}đ`
    : 'Giảm giá');

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
        🎟 {code} {name && `- ${name}`}
      </Box>

      {/* Nội dung chính */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          backgroundColor: '#fafafa',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', color: isEligible ? '#d32f2f' : '#9e9e9e' }}
        >
          {displayDiscountText}
        </Typography>

        {minOrderAmount !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Đơn tối thiểu: {minOrderAmount.toLocaleString()}đ
          </Typography>
        )}

        {validFrom && validUntil && (
          <Typography variant="caption" display="block" color="text.secondary">
            {`Hiệu lực: ${new Date(validFrom).toLocaleDateString()} - ${new Date(validUntil).toLocaleDateString()}`}
          </Typography>
        )}

        {maxUses !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Số lần tối đa: {maxUses}
          </Typography>
        )}

        {maxUsesPerUser !== undefined && (
          <Typography variant="caption" color="text.secondary">
            Mỗi người tối đa: {maxUsesPerUser}
          </Typography>
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
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={onCopy}
            disabled={currentTotalAmount !== undefined && !isEligible}
            sx={{
              borderColor: isEligible ? '#ff9800' : '#bdbdbd',
              color: isEligible ? '#ff9800' : '#bdbdbd',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 1.5,
              borderRadius: 2,
            }}
          >
            Sao chép
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleClaim}
            disabled={currentTotalAmount !== undefined && !isEligible || isClaimed} // ✅ Vô hiệu hóa nếu đã lưu
            sx={{
              background: isClaimed
                ? 'linear-gradient(90deg, #9e9e9e, #616161)' // Màu xám nếu đã lưu
                : isEligible
                ? 'linear-gradient(90deg, #4caf50, #2e7d32)' // Màu xanh nếu có thể lưu
                : '#bdbdbd',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: isClaimed
                  ? 'linear-gradient(90deg, #9e9e9e, #616161)' // Không đổi nếu đã lưu
                  : isEligible
                  ? 'linear-gradient(90deg, #2e7d32, #1b5e20)' // Hover xanh
                  : '#bdbdbd',
              },
            }}
          >
            {isClaimed ? 'Đã lưu' : 'Lưu'} {/* ✅ Hiển thị trạng thái */}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherCard;