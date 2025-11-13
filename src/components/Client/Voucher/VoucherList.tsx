// src/components/Client/Voucher/VoucherList.tsx
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import VoucherCard from './VoucherCard';
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

        if (res && res.success && Array.isArray(res.data)) {
          // ✅ Ánh xạ dữ liệu từ backend sang interface Voucher
          const mappedVouchers: Voucher[] = res.data.map(v => ({
            ...v,
            // ✅ Đảm bảo type và value luôn có giá trị
            type: v.type || 'fixed',
            value: v.value || 0,
            // ✅ Tính toán discountText nếu chưa có
            discountText: v.discountText || (
              v.type && v.value !== undefined
                ? v.type === 'percentage'
                  ? `Giảm ${v.value}%`
                  : `Giảm ${v.value.toLocaleString()}đ`
                : 'Giảm giá'
            ),
            // ✅ Tính toán conditionText nếu chưa có
            conditionText: v.conditionText || (
              v.minOrderAmount !== undefined
                ? `Đơn tối thiểu ${v.minOrderAmount.toLocaleString()}đ`
                : 'Không có điều kiện'
            ),
          }));

          setVouchers(mappedVouchers);
        } else {
          console.error('Cấu trúc phản hồi voucher không hợp lệ:', res);
          setError('Dữ liệu voucher không hợp lệ.');
          setVouchers([]);
        }
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách voucher:', err);
        setError('Lỗi kết nối đến máy chủ');
        setVouchers([]);
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
          _id={voucher._id}
          code={voucher.code}
          name={voucher.name}
          description={voucher.description}
          type={voucher.type}
          value={voucher.value}
          shopName={voucher.shopName}
          minOrderAmount={voucher.minOrderAmount}
          validFrom={voucher.validFrom}
          validUntil={voucher.validUntil}
          maxUses={voucher.maxUses}
          maxUsesPerUser={voucher.maxUsesPerUser}
          isActive={voucher.isActive}
          discountText={voucher.discountText}
          conditionText={voucher.conditionText}
          isFreeShip={voucher.isFreeShip}
          currentTotalAmount={totalAmount}
          onCopy={() => handleCopy(voucher.code)}
        />
      ))}
    </Box>
  );
};

export default VoucherList;