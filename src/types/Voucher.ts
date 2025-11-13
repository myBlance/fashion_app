export interface Voucher {
  _id: string;
  code: string;
  name?: string;
  description?: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  discountText: string;
  conditionText: string;
  minOrderAmount: number;   // trùng với VoucherCard
  minOrderValue?: number;   // nếu cần hiển thị thêm
  shopName?: string;
  expiryDate: string; // ISO string
  validFrom?: string; // ISO string
  validUntil?: string; // ISO string
  isFreeShip?: boolean;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Interface cho voucher trong wishlist, có thể bao gồm trạng thái hiện tại
export interface SavedVoucher extends Voucher {
  isExpired: boolean; // Trạng thái tính toán từ frontend hoặc backend
  isOutOfUses: boolean; // Trạng thái tính toán từ frontend hoặc backend
}
