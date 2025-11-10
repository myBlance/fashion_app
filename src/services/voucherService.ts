// src/services/voucherService.ts
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

export const VoucherService = {
  // Lấy danh sách voucher
  async getVouchers(params?: {
    shopName?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    expired?: boolean;
  }): Promise<VoucherListResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers`, {
      params,
    });
    return res.data;
  },

  // Lấy voucher theo mã
  async getVoucherByCode(code: string): Promise<VoucherResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/${code}`);
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