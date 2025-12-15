import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { VoucherService } from '../../../services/voucherService';
import { Voucher } from '../../../types/Voucher';

interface VoucherModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (voucher: Voucher | null) => void;
  selectedVoucher: Voucher | null;
  totalAmount: number;
}

interface DisplayVoucher extends Voucher {
  isSaved: boolean;
  discountValue: number; // Calculated discount amount
  isEligible: boolean;
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  open,
  onClose,
  onSelect,
  selectedVoucher,
  totalAmount,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(selectedVoucher?._id || null);
  const [vouchers, setVouchers] = useState<DisplayVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const [publicRes, myRes] = await Promise.all([
            VoucherService.getVouchers(),
            token ? VoucherService.getMyVouchers(token) : Promise.resolve({ success: true, data: [] })
          ]);

          let allVouchers: Voucher[] = [];
          const savedIds = new Set<string>();

          // Process My Vouchers
          if (myRes.success && Array.isArray(myRes.data)) {
            myRes.data.forEach(uv => {
              if (uv.voucher) {
                // Ensure unique
                if (!allVouchers.find(v => v._id === uv.voucher._id)) {
                  allVouchers.push(uv.voucher);
                }
                savedIds.add(uv.voucher._id);
              }
            });
          }

          // Process Public Vouchers
          if (publicRes.success && Array.isArray(publicRes.data)) {
            publicRes.data.forEach(v => {
              // Add if not already present (prefer the instance from My Vouchers if exists, though data should be same)
              if (!allVouchers.find(av => av._id === v._id)) {
                allVouchers.push(v);
              }
            });
          }

          // Process logic for display: Calculate discount, check saved, check eligibility
          const processed: DisplayVoucher[] = allVouchers.map(v => {
            const isSaved = savedIds.has(v._id);
            const isEligible = v.isActive && totalAmount >= (v.minOrderAmount || 0);

            let discountValue = 0;
            if (v.type === 'fixed') {
              discountValue = v.value || 0;
            } else {
              discountValue = (totalAmount * (v.value || 0)) / 100;
              // If there's a max discount cap, we should handle it, but interface doesn't show it. 
              // Assuming no cap or handled elsewhere for now.
            }

            return {
              ...v,
              isSaved,
              discountValue,
              isEligible
            };
          });

          // SORTING LOGIC:
          // 1. Saved first
          // 2. Best discount (descending)
          processed.sort((a, b) => {
            if (a.isSaved !== b.isSaved) {
              return a.isSaved ? -1 : 1; // Saved comes first
            }
            return b.discountValue - a.discountValue; // Higher discount comes first
          });

          setVouchers(processed);

        } catch (err: any) {
          console.error('Lỗi khi lấy danh sách voucher:', err);
          setError('Lỗi kết nối đến máy chủ');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(true);
      setError(null);
      setVouchers([]);
    }
  }, [open, totalAmount]);

  useEffect(() => {
    setSelectedId(selectedVoucher?._id || null);
  }, [selectedVoucher]);

  const handleSelect = (voucher: DisplayVoucher) => {
    // Enable selecting any voucher to verify validation message
    // if (!voucher.isEligible) return; 
    setSelectedId(voucher._id);
    onSelect(voucher);
  };

  const handleConfirm = () => {
    if (selectedId) {
      // Find based on ID in DisplayVoucher list to return standard Voucher object
      const selected = vouchers.find(v => v._id === selectedId);
      if (selected) {
        // Strip extra props if needed, but TS might complain if we return DisplayVoucher as Voucher.
        // Since DisplayVoucher extends Voucher, it IS a Voucher.
        onSelect(selected);
      } else {
        onSelect(null);
      }
    } else {
      onSelect(null);
    }
    onClose();
  };

  const getDiscountText = (v: DisplayVoucher) => {
    if (v.discountText) return v.discountText;
    if (v.type === 'percentage') return `Giảm ${v.value}%`;
    return `Giảm ${(v.value || 0).toLocaleString()}đ`;
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh'
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalOfferIcon sx={{ color: '#ff5722' }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1.1rem', fontWeight: 600 }}>
          Chọn Voucher Ưu Đãi
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : vouchers.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 4, color: '#666' }}>Không có voucher nào khả dụng</Typography>
          ) : (
            vouchers.map((voucher) => (
              <Box
                key={voucher._id}
                onClick={() => handleSelect(voucher)}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 1,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  opacity: voucher.isEligible ? 1 : 0.7,
                  border: selectedId === voucher._id ? '1px solid #ff5722' : '1px solid #eee',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: voucher.isEligible ? '#ff5722' : '#eee'
                  }
                }}
              >
                {/* Saved Badge */}
                {voucher.isSaved && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bgcolor: '#ff5722',
                    color: '#fff',
                    fontSize: '0.65rem',
                    px: 0.8,
                    py: 0.2,
                    borderBottomRightRadius: 4
                  }}>
                    Đã lưu
                  </Box>
                )}

                {/* Left: Image/Icon */}
                <Box sx={{
                  width: 60,
                  height: 60,
                  bgcolor: '#fff5f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  mr: 2,
                  color: '#ff5722',
                  flexShrink: 0
                }}>
                  <LocalOfferIcon fontSize="large" />
                </Box>

                {/* Middle: Content */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                    {getDiscountText(voucher)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Trị giá: {voucher.discountValue.toLocaleString()}đ (Đơn tối thiểu {(voucher.minOrderAmount || 0).toLocaleString()}đ)
                  </Typography>
                  {/* Simplified Date */}
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                    HSD: {voucher.validUntil ? new Date(voucher.validUntil).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ color: '#777', mt: 0.5, fontSize: '0.7rem' }}>
                    Số lượng còn lại: {voucher.maxUses ? Math.max(0, voucher.maxUses - (voucher.usedCount || 0)) : 'Không giới hạn'} (Đã dùng: {voucher.usedCount})
                  </Typography>
                </Box>

                {/* Right: Radio/Action */}
                <Box sx={{ ml: 1 }}>
                  {selectedId === voucher._id ? (
                    <CheckCircleIcon sx={{ color: '#ff5722' }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ color: '#ccc' }} />
                  )}
                </Box>
              </Box>
            ))
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #f0f0f0', p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" fullWidth>
          Hủy
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!selectedId} sx={{ bgcolor: '#ff5722', '&:hover': { bgcolor: '#e64a19' } }} fullWidth>
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherModal;