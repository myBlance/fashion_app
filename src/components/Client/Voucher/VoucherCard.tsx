// src/components/Client/Voucher/VoucherCard.tsx
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import React from 'react';
import '../../../styles/VoucherCard.css';

export interface VoucherCardProps {
  _id: string;
  code: string;
  name?: string;
  description?: string;
  type?: 'fixed' | 'percentage';
  value?: number;
  shopName?: string;
  validFrom?: string;
  validUntil?: string;
  minOrderAmount?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  isActive?: boolean;
  discountText?: string;
  conditionText?: string;
  isFreeShip?: boolean;
  currentTotalAmount?: number;
  onCopy: () => void;
  onClaim?: (code: string) => void;
  isClaimed?: boolean;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  code,
  name,
  type,
  value,
  validFrom,
  validUntil,
  minOrderAmount = 0,
  maxUses,
  maxUsesPerUser,
  isActive = true,
  discountText,
  isFreeShip = false,
  currentTotalAmount,
  onCopy,
  onClaim,
  isClaimed = false,
}) => {
  const isEligible =
    currentTotalAmount !== undefined ? currentTotalAmount >= minOrderAmount && isActive : isActive;

  const handleClaim = () => {
    if (onClaim && !isClaimed) {
      onClaim(code);
    }
  };

  // Tính toán discountText nếu không có
  const displayDiscountText = discountText || (type && value !== undefined
    ? type === 'percentage'
      ? `Giảm ${value}%`
      : `Giảm ${value.toLocaleString()}đ`
    : 'Giảm giá');

  return (
    <div className={`voucher-card ${isEligible ? 'eligible' : 'ineligible'}`}>
      {/* Header */}
      <div className={`voucher-card-header ${isFreeShip ? 'freeship' : ''}`}>
        <span className="voucher-card-code">
          {code} {name && `- ${name}`}
        </span>
      </div>

      {/* Body */}
      <div className="voucher-card-body">
        <div className={`voucher-discount-text ${!isEligible ? 'ineligible' : ''}`}>
          {displayDiscountText}
        </div>

        {minOrderAmount !== undefined && (
          <div className="voucher-card-info">
            Đơn tối thiểu: {minOrderAmount.toLocaleString()}đ
          </div>
        )}

        {validFrom && validUntil && (
          <div className="voucher-card-info">
            Hiệu lực: {new Date(validFrom).toLocaleDateString()} - {new Date(validUntil).toLocaleDateString()}
          </div>
        )}

        {maxUses !== undefined && (
          <div className="voucher-card-info">
            Số lần tối đa: {maxUses}
          </div>
        )}

        {maxUsesPerUser !== undefined && (
          <div className="voucher-card-info">
            Mỗi người tối đa: {maxUsesPerUser}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="voucher-card-footer">
        <div className={`voucher-status-badge ${isEligible ? 'eligible' : 'ineligible'}`}>
          <LocalOfferIcon />
          {isEligible ? 'Có thể áp dụng' : 'Không đủ điều kiện'}
        </div>

        <div className="voucher-card-actions">
          <button
            className="voucher-action-btn voucher-copy-btn"
            onClick={onCopy}
            disabled={currentTotalAmount !== undefined && !isEligible}
          >
            Sao chép
          </button>
          <button
            className={`voucher-action-btn voucher-claim-btn ${isClaimed ? 'claimed' : ''}`}
            onClick={handleClaim}
            disabled={(currentTotalAmount !== undefined && !isEligible) || isClaimed}
          >
            {isClaimed ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;