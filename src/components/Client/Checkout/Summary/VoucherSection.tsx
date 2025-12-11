import React, { useState } from 'react';
import { Voucher } from '../../../../types/Voucher';
import VoucherModal from '../../Voucher/VoucherModal';

interface VoucherSectionProps {
    selectedVoucher: Voucher | null;
    onSelectVoucher: (voucher: Voucher | null) => void;
    isVoucherValid: boolean;
}

const VoucherSection: React.FC<VoucherSectionProps> = ({ selectedVoucher, onSelectVoucher, isVoucherValid }) => {
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
                        <div>
                            <strong>{selectedVoucher.code}</strong> - {getVoucherDisplayText(selectedVoucher)}
                            {!isVoucherValid && (
                                <span className="voucher-warning">
                                    (Không đủ điều kiện)
                                </span>
                            )}
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
