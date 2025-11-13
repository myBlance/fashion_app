// src/types/Voucher.ts
export interface Voucher {
  _id: string;
  code: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  discountText: string;
  conditionText: string;
  minOrderValue: number;
  shopName: string;
  expiryDate: string; // ISO string
  isFreeShip: boolean;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Interface cho voucher trong wishlist, có thể bao gồm trạng thái hiện tại
export interface SavedVoucher extends Voucher {
  isExpired: boolean; // Trạng thái tính toán từ frontend hoặc backend
  isOutOfUses: boolean; // Trạng thái tính toán từ frontend hoặc backend
}