import axios from 'axios';

export interface Voucher {
  _id: string;
  code: string;
  discountText: string;
  conditionText: string;
  isFreeShip?: boolean;
  shopName: string;
  minOrderValue: number;
  expiryDate: string; // ISO string
  discountType: 'fixed' | 'percent';
  discountValue: number;
}

export interface VoucherListResponse {
  success: boolean;
  data: Voucher[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VoucherResponse {
  success: boolean;
  data: Voucher;
}

export interface UserVoucher {
  id: string;
  voucher: Voucher;
  claimedAt: string; // ISO string
  usedAt: string | null; // ISO string or null
  isUsed: boolean;
}

export interface UserVoucherListResponse {
  success: boolean;
  data: UserVoucher[];
}

export interface ClaimVoucherRequest {
  code: string;
}

export interface ClaimVoucherResponse {
  success: boolean;
  message: string;
  voucher?: Voucher;
}

export const VoucherService = {
  // Lấy danh sách voucher (public - dành cho khách xem chung)
  async getVouchers(params?: {
    shopName?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    expired?: boolean;
  }): Promise<VoucherListResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/public`, {
      params,
    });
    return res.data;
  },

  // Lấy voucher theo ID (public)
  async getVoucherById(id: string): Promise<VoucherResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/${id}`);
    return res.data;
  },

  // CLAIM voucher (dành cho người dùng - yêu cầu token)
  async claimVoucher(code: string, token: string): Promise<ClaimVoucherResponse> {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/vouchers/claim`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  },

  // Lấy danh sách voucher của người dùng (riêng tư)
  async getMyVouchers(token: string): Promise<UserVoucherListResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Tạo voucher mới (admin)
  async createVoucher(voucherData: Omit<Voucher, '_id'>, token: string): Promise<VoucherResponse> {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Cập nhật voucher (admin)
  async updateVoucher(id: string, voucherData: Partial<Voucher>, token: string): Promise<VoucherResponse> {
    const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/${id}`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  // Xóa voucher (admin)
  async deleteVoucher(id: string, token: string): Promise<{ success: boolean; message: string }> {
    const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
};