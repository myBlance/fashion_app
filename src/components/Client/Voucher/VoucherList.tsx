// src/components/client/Voucher/VoucherList.tsx
import React, { useState, useEffect } from 'react';
import VoucherCard from './VoucherCard';
import { Box, CircularProgress, Alert } from '@mui/material';
import { VoucherService, Voucher } from '../../../services/voucherService'; // Điều chỉnh đường dẫn nếu cần

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
        console.log('DEBUG: Response from VoucherService.getVouchers:', res); // Log để debug

        // 🔴 Kiểm tra cấu trúc phản hồi
        if (res && typeof res === 'object' && res.success === true && Array.isArray(res.data)) {
          // Gán mảng trực tiếp nếu cấu trúc đúng
          setVouchers(res.data);
        } else {
          // Nếu cấu trúc không đúng, có thể backend trả về lỗi hoặc cấu trúc khác
          console.error('Cấu trúc phản hồi voucher không hợp lệ:', res);
          setError('Dữ liệu voucher không hợp lệ.');
          setVouchers([]); // Gán mảng rỗng để tránh lỗi render
        }
      } catch (err: any) {
        console.error('Lỗi khi lấy danh sách voucher:', err);
        setError('Lỗi kết nối đến máy chủ');
        setVouchers([]); // Gán mảng rỗng để tránh lỗi render
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

  // 🔴 Kiểm tra an toàn trước khi map (dù đã setVouchers([]) trong catch)
  // Dòng này chỉ an toàn hơn, nhưng nếu setVouchers luôn được gọi với mảng, thì không cần thiết
  if (!Array.isArray(vouchers)) {
    console.error('Biến vouchers không phải là mảng:', vouchers);
    return <Box sx={{ px: 2 }}><Alert severity="error">Dữ liệu voucher bị lỗi.</Alert></Box>;
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
      {vouchers.map((voucher) => ( // <-- Bây giờ `vouchers` chắc chắn là mảng
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