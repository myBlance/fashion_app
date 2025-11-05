import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/wishlist`;

export const WishlistService = {
  async getWishlist(userId: string) {
    const res = await axios.get<string[]>(`${API_URL}/${userId}`);
    return res.data;
  },

  async addToWishlist(userId: string, productId: string) {
    const res = await axios.post(API_URL, { userId, productId });
    return res.data;
  },

  async removeFromWishlist(userId: string, productId: string) {
    const res = await axios.delete(API_URL, { data: { userId, productId } });
    return res.data;
  }
};