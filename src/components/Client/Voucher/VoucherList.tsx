import { Alert, Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { UserVoucher, VoucherService } from '../../../services/voucherService';
import '../../../styles/VoucherList.css';
import { Voucher } from '../../../types/Voucher';
import VoucherCard from './VoucherCard';

interface VoucherListProps {
  totalAmount?: number;
}

const VoucherList: React.FC<VoucherListProps> = ({ totalAmount }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [claimedVoucherCodes, setClaimedVoucherCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await VoucherService.getVouchers();

        if (res && res.success && Array.isArray(res.data)) {
          const mappedVouchers: Voucher[] = res.data.map(v => ({
            ...v,
            type: v.type || 'fixed',
            value: v.value || 0,
            discountText: v.discountText || (
              v.type && v.value !== undefined
                ? v.type === 'percentage'
                  ? `Giảm ${v.value}%`
                  : `Giảm ${v.value.toLocaleString()}đ`
                : 'Giảm giá'
            ),
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

    const fetchClaimedVouchers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      try {
        const res = await VoucherService.getMyVouchers(token);
        if (res && res.success && Array.isArray(res.data)) {
          const codes = res.data.map((uv: UserVoucher) => uv.voucher.code);
          setClaimedVoucherCodes(codes);
        }
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          // Token expired or invalid, just ignore
          console.warn('Phiên đăng nhập hết hạn hoặc không hợp lệ.');
        } else {
          console.error('Lỗi khi lấy danh sách voucher đã lưu:', err);
        }
      }
    };

    fetchVouchers();
    fetchClaimedVouchers();
  }, []);

  const handleClaim = async (code: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Bạn cần đăng nhập để lưu voucher.', 'warning');
      return;
    }
    try {
      const res = await VoucherService.claimVoucher(code, token);
      if (res.success) {
        showToast(res.message, 'success');
        // ✅ Cập nhật lại danh sách đã lưu sau khi claim thành công
        setClaimedVoucherCodes(prev => [...prev, code]);
      } else {
        showToast(`Lỗi: ${res.message}`, 'error');
      }
    } catch (err) {
      console.error('Lỗi khi claim voucher:', err);
      showToast('Không thể lưu voucher. Vui lòng thử lại.', 'error');
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Đã sao chép mã: ${code}`, 'success');
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

  // ✅ Debug: Kiểm tra số lượng vouchers
  console.log('VoucherList - Total vouchers:', vouchers.length);
  console.log('VoucherList - Vouchers data:', vouchers);

  if (vouchers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <p>Không có voucher nào khả dụng.</p>
      </Box>
    );
  }

  return (
    <div className="voucher-list-container">
      {vouchers.map((voucher) => (
        <div key={voucher._id} className="voucher-list-item">
          <VoucherCard
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
            onClaim={handleClaim}
            isClaimed={claimedVoucherCodes.includes(voucher.code)}
          />
        </div>
      ))}
    </div>
  );
};

export default VoucherList;