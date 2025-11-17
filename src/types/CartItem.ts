export interface CartItem {
  id?: string;       // _id của CartItem trong MongoDB
  productId: string;
  name: string;
  color?: string;
  size?: string;
  price?: number;
  quantity?: number;
  image?: string;
}