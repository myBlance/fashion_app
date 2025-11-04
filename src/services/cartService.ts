import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/cart`;

export const CartService = {
  async getCart(userId: string) {
    const res = await axios.get(`${API_URL}/${userId}`);
    return res.data;
  },

  async syncCart(userId: string, items: CartItem[]) {
  await axios.post(`${API_URL}/sync`, { userId, items });
},

  async addToCart(userId: string, item: any) {
    // gửi đúng endpoint backend
    const payload = {
      userId,
      productId: item.id,
      name: item.name,
      color: item.color,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    };

    const res = await axios.post(`${API_URL}`, payload); 
    return res.data;
  },

  async updateQuantity(userId: string, productId: string, color: string, size: string, quantity: number) {
    const res = await axios.put(`${API_URL}/update`, { userId, productId, color, size, quantity });
    return res.data;
  },

  async removeItem(userId: string, productId: string, color: string, size: string) {
    const res = await axios.delete(`${API_URL}`, { data: { userId, productId, color, size } });
    return res.data;
  },
};
