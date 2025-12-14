import axios from "axios";
import { CartItem } from "../types/CartItem";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/carts`;

export const CartService = {
  // CartService.ts
  // Lấy giỏ hàng
  async getCart(userId: string): Promise<CartItem[]> {
    const res = await axios.get(`${API_URL}/${userId}`);
    return res.data.map((item: any) => ({
      id: item._id,
      productId: item.productId,
      name: item.name,
      color: item.color ?? '',
      size: item.size ?? '',
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      image: item.image ?? '',
      stock: item.stock ?? 0,
    }));
  },

  // Thêm sản phẩm vào giỏ
  async addToCart(userId: string, item: CartItem): Promise<CartItem> {
    const payload = {
      userId,
      productId: item.productId,
      name: item.name,
      color: item.color ?? '',
      size: item.size ?? '',
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      image: item.image ?? '',
    };
    const res = await axios.post(`${API_URL}`, payload);
    return {
      id: res.data._id,
      productId: res.data.productId,
      name: res.data.name,
      color: res.data.color ?? '',
      size: res.data.size ?? '',
      price: res.data.price ?? 0,
      quantity: res.data.quantity ?? 1,
      image: res.data.image ?? '',
      stock: res.data.stock ?? 0,
    };
  },

  // Sửa: Xóa sản phẩm khỏi giỏ
  async removeItem(productId: string, userId: string, color?: string, size?: string) {
    const payload = { userId, productId, color, size }; // Gửi `productId`, không phải `cartItemId`
    const res = await axios.delete(`${API_URL}`, { data: payload });
    return res.data;
  },

  // Sửa: Cập nhật số lượng
  async updateQuantity(
    productId: string, // Thay `cartItemId` bằng `productId`
    userId: string,
    quantity: number,
    color?: string,
    size?: string
  ) {
    const payload = { userId, productId, color, size, quantity }; // Gửi `productId`
    const res = await axios.put(`${API_URL}/update`, payload);
    return res.data;
  },

  // Sửa: Cập nhật phân loại (Màu/Size)
  async updateVariant(
    userId: string,
    productId: string,
    oldColor: string,
    oldSize: string,
    newColor: string,
    newSize: string
  ): Promise<CartItem[]> {
    const payload = { userId, productId, oldColor, oldSize, newColor, newSize };
    const res = await axios.put(`${API_URL}/update-variant`, payload);
    return res.data.map((item: any) => ({
      id: item._id,
      productId: item.productId,
      name: item.name,
      color: item.color ?? '',
      size: item.size ?? '',
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      image: item.image ?? '',
      stock: item.stock ?? 0,
    }));
  },

  // Đồng bộ giỏ hàng (sau login hoặc merge)
  async syncCart(userId: string, items: CartItem[]): Promise<CartItem[]> {
    const payload = { userId, items };
    const res = await axios.post(`${API_URL}/sync`, payload);
    return res.data.map((item: any) => ({
      id: item._id,
      productId: item.productId,
      name: item.name,
      color: item.color ?? '',
      size: item.size ?? '',
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      image: item.image ?? '',
      stock: item.stock ?? 0,
    }));
  },
};