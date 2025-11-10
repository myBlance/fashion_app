// src/components/Client/Voucher/VoucherModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { VoucherService, Voucher } from '../../../services/voucherService';
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
  const [selectedId, setSelectedId] = useState<string | null>(selectedVoucher?._id || null); // ✅ Sửa `id` thành `_id`
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
    setSelectedId(voucher._id); // ✅ Dùng `_id` thay vì `id`
    onSelect(voucher);
  };

  const handleConfirm = () => {
    if (selectedId) {
      const selected = vouchers.find(v => v._id === selectedId); // ✅ Dùng `_id`
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
      maxWidth="sm"
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
        <Box sx={{ maxHeight: 450, overflowY: 'auto', mt: 1 }}>
          {vouchers.map((voucher) => (
            <Box
              key={voucher._id} // ✅ Dùng `_id` làm key
              onClick={() => handleSelect(voucher)}
              sx={{
                p: 2.5,
                mb: 2,
                border: selectedId === voucher._id ? '2px solid #f57c00' : '1px solid #ddd',
                borderRadius: 2.5,
                backgroundColor: selectedId === voucher._id ? '#fff3e0' : '#fff',
                transition: 'all 0.25s ease',
                boxShadow:
                  selectedId === voucher._id
                    ? '0 4px 12px rgba(255,152,0,0.2)'
                    : '0 2px 6px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  backgroundColor: '#fffefb',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    {voucher.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {voucher.shopName}
                  </Typography>
                </Box>

                {voucher.isFreeShip && (
                  <Chip
                    icon={<DirectionsCarIcon />}
                    label="Miễn phí vận chuyển"
                    size="small"
                    sx={{
                      backgroundColor: '#ffecb3',
                      color: '#795548',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body1" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    {voucher.discountText}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Đơn Tối Thiểu {voucher.minOrderValue.toLocaleString()}đ
                  </Typography>
                </Box>
                <Tooltip title={voucher.conditionText}>
                  <Chip
                    icon={<LocalOfferIcon />}
                    label="Áp dụng có điều kiện"
                    size="small"
                    sx={{
                      backgroundColor: '#c62828',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Tooltip>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                HSD: {voucher.expiryDate}
              </Typography>

              {selectedId === voucher._id && (
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Đã chọn"
                    size="small"
                    color="success"
                    sx={{
                      fontWeight: 'bold',
                      boxShadow: '0 2px 6px rgba(76,175,80,0.4)',
                    }}
                  />
                </Box>
              )}
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