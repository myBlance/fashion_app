import React, { useState } from 'react';
import { Voucher } from '../../../../types/Voucher';
import VoucherModal from '../../Voucher/VoucherModal';

interface VoucherSectionProps {
    selectedVoucher: Voucher | null;
    onSelectVoucher: (voucher: Voucher | null) => void;
    isVoucherValid: boolean;
    invalidReason?: string | null;
    totalAmount: number;
}

const VoucherSection: React.FC<VoucherSectionProps> = ({ selectedVoucher, onSelectVoucher, isVoucherValid, invalidReason, totalAmount }) => {
    // 1. Hooks & State
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

    // 2. Logic & Calculations
    const getVoucherDisplayText = (voucher: Voucher | null) => {
        if (!voucher) return '';
        if (voucher.type === 'percentage') return `Giảm ${voucher.value}%`;
        if (voucher.type === 'fixed') return `Giảm ${(voucher.value || 0).toLocaleString()}₫`;
        return 'Giảm giá';
    };

    // 3. Render
    return (
        <>
            <VoucherModal
                open={isVoucherModalOpen}
                onClose={() => setIsVoucherModalOpen(false)}
                onSelect={onSelectVoucher}
                selectedVoucher={selectedVoucher}
                totalAmount={totalAmount}
            />

            <div className="section voucher-section">
                <div className="voucher-row">
                    <div className="voucher-label">Voucher từ Shop</div>
                    <button
                        className="choose-voucher"
                        onClick={() => setIsVoucherModalOpen(true)}
                    >
                        Chọn Voucher
                    </button>
                </div>

                {selectedVoucher && (
                    <div className={`selected-voucher ${isVoucherValid ? 'valid' : 'invalid'}`}>
                        <div style={{ flexGrow: 1 }}>
                            <div className="voucher-info">
                                <strong>{selectedVoucher.code}</strong> - {getVoucherDisplayText(selectedVoucher)}
                                {!isVoucherValid && (
                                    <span style={{ color: '#d32f2f', marginLeft: '8px', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                        {invalidReason === 'usage_limit'
                                            ? ` Bạn đã dùng hết ${selectedVoucher.maxUsesPerUser} lượt sử dụng cho voucher này`
                                            : ` Chưa đủ điều kiện: Cần đơn tối thiểu ${(selectedVoucher.minOrderAmount || 0).toLocaleString()}đ`
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => onSelectVoucher(null)}
                            className="delete-voucher-btn"
                        >
                            Xóa
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default VoucherSection;
