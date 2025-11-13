import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { VoucherService, Voucher } from '../../../services/voucherService';
import VoucherCard from './VoucherCard'; // ✅ Import VoucherCard

interface VoucherModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (voucher: Voucher | null) => void;
  selectedVoucher: Voucher | null;
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  open,
  onClose,
  onSelect,
  selectedVoucher,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(selectedVoucher?._id || null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
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
    } else {
      // Reset state khi đóng modal
      setLoading(true);
      setError(null);
      setVouchers([]);
    }
  }, [open]);

  // Cập nhật selectedId khi selectedVoucher thay đổi từ bên ngoài
  useEffect(() => {
    setSelectedId(selectedVoucher?._id || null);
  }, [selectedVoucher]);

  const handleSelect = (voucher: Voucher) => {
    setSelectedId(voucher._id);
    onSelect(voucher);
  };

  const handleConfirm = () => {
    if (selectedId) {
      const selected = vouchers.find(v => v._id === selectedId);
      onSelect(selected || null);
    } else {
      onSelect(null);
    }
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Chọn Voucher</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Chọn Voucher</DialogTitle>
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md" // ✅ Tăng kích thước để chứa card
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
          color: '#d32f2f',
          textAlign: 'center',
          borderBottom: '2px solid #f0f0f0',
        }}
      >
        🎁 Chọn Voucher Ưu Đãi
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: '#fafafa' }}>
        <Box
          sx={{
            maxHeight: 500,
            overflowY: 'auto',
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2, // Khoảng cách giữa các card
            alignItems: 'center', // Căn giữa các card
          }}
        >
          {vouchers.map((voucher) => (
            <Box
              key={voucher._id}
              onClick={() => handleSelect(voucher)}
              sx={{
                cursor: 'pointer',
                border: selectedId === voucher._id ? '3px solid #f57c00' : '1px solid transparent', // Viền nổi bật khi chọn
                borderRadius: 3,
                transition: 'border-color 0.2s',
                '&:hover': {
                  border: '3px solid #ffa726', // Viền khi hover
                },
              }}
            >
              {/* ✅ Dùng VoucherCard thay vì render thủ công */}
              <VoucherCard
                _id={voucher._id}
                code={voucher.code}
                name={voucher.name}
                description={voucher.description}
                type={voucher.type}
                value={voucher.value}
                shopName={voucher.shopName}
                validFrom={voucher.validFrom}
                validUntil={voucher.validUntil}
                minOrderAmount={voucher.minOrderValue} // ✅ Dùng minOrderValue
                maxUses={voucher.maxUses}
                maxUsesPerUser={voucher.maxUsesPerUser}
                isActive={voucher.isActive}
                discountText={voucher.discountText}
                conditionText={voucher.conditionText}
                isFreeShip={voucher.isFreeShip}
                currentTotalAmount={undefined} // Không có tổng tiền trong modal
                onCopy={() => handleSelect(voucher)} // ✅ Gọi handleSelect khi nhấn vào card
              />
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #eee',
          backgroundColor: '#fff',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            color: '#616161',
            '&:hover': { color: '#000' },
          }}
        >
          Trở lại
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          sx={{
            fontWeight: 'bold',
            px: 4,
            py: 1,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: '0 3px 8px rgba(211,47,47,0.3)',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherModal;