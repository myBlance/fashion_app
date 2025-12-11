import React from 'react';
import { Voucher } from '../../../../types/Voucher';

interface OrderTotalSectionProps {
    totalAmount: number;
    shippingFee: number;
    finalTotal: number;
    selectedVoucher: Voucher | null;
    isVoucherValid: boolean;
    discountAmount: number;
}

const OrderTotalSection: React.FC<OrderTotalSectionProps> = ({
    totalAmount,
    shippingFee,
    finalTotal,
    selectedVoucher,
    isVoucherValid,
    discountAmount
}) => {
    // 1. Render
    return (
        <div className="section total-section">
            <div className="total-row">
                <span>Tổng tiền hàng</span>
                <span>{totalAmount.toLocaleString()}₫</span>
            </div>
            {selectedVoucher && isVoucherValid && (
                <div className="total-row">
                    <span>Giảm giá ({selectedVoucher.code})</span>
                    <span className="discount-valid">-{discountAmount.toLocaleString()}₫</span>
                </div>
            )}
            {selectedVoucher && !isVoucherValid && (
                <div className="total-row">
                    <span>Giảm giá ({selectedVoucher.code})</span>
                    <span className="discount-invalid">Không áp dụng</span>
                </div>
            )}
            <div className="total-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()}₫</span>
            </div>
            <div className="total-row total-final">
                <strong>Tổng thanh toán</strong>
                <strong>{finalTotal.toLocaleString()}₫</strong>
            </div>
        </div>
    );
};

export default OrderTotalSection;
