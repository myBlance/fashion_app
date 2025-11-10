import React, { useState, useEffect } from 'react';
import VoucherCard from './VoucherCard';
import { Box, CircularProgress, Alert } from '@mui/material';
import { VoucherService, Voucher } from '../../../services/voucherService';

interface VoucherListProps {
  totalAmount?: number; 
}

const VoucherList: React.FC<VoucherListProps> = ({ totalAmount }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await VoucherService.getVouchers();
        if (res.success) {
          setVouchers(res.data);
        } else {
          setError('Không thể tải danh sách voucher');
        }
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách voucher:', err);
        setError('Lỗi kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      {vouchers.map((voucher) => (
        <VoucherCard
          key={voucher._id}
          code={voucher.code}
          discountText={voucher.discountText}
          conditionText={voucher.conditionText}
          isFreeShip={voucher.isFreeShip}
          shopName={voucher.shopName}
          minOrderValue={voucher.minOrderValue}
          expiryDate={voucher.expiryDate}
          currentTotalAmount={totalAmount}
          onCopy={() => handleCopy(voucher.code)}
        />
      ))}
    </Box>
  );
};

export default VoucherList;