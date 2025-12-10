export interface Review {
  id?: string; // React Admin uses 'id'
  _id: string;
  orderId: string;
  productId: string;
  productName?: string;
  productCode?: string;
  userId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
}