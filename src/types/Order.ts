export interface Product {
  _id: string;
  code: string;
  name: string;
  image?: string;
  price: number;
}

export interface ProductInOrder {
  product: Product | null;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  user: string | { username: string; email: string };
  products: ProductInOrder[];
  totalPrice: number;
  status: 'pending' | 'awaiting_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid';
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
  };
  createdAt: string;
  updatedAt?: string;
}