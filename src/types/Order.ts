export interface Order {
  id: string;
  user: { username: string; email: string };
  products: Array<{
    product: { _id: string; name: string; price: number; image?: string };
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  totalPrice: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: { fullName: string; phone: string; addressLine: string };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}