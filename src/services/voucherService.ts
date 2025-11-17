import axios from 'axios';
import { Voucher } from '../types/Voucher';


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
  claimedAt: string;
  usedAt: string | null;
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
  async getVouchers(params?: {
    shopName?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    expired?: boolean;
  }): Promise<VoucherListResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/public`, { params });
    return res.data;
  },

  async getVoucherById(id: string): Promise<VoucherResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/${id}`);
    return res.data;
  },

  async claimVoucher(code: string, token: string): Promise<ClaimVoucherResponse> {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/vouchers/claim`,
      { code },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  async getMyVouchers(token: string): Promise<UserVoucherListResponse> {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async createVoucher(voucherData: Omit<Voucher, '_id'>, token: string): Promise<VoucherResponse> {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers`, voucherData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async updateVoucher(id: string, voucherData: Partial<Voucher>, token: string): Promise<VoucherResponse> {
    const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/${id}`, voucherData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async deleteVoucher(id: string, token: string): Promise<{ success: boolean; message: string }> {
    const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/vouchers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
