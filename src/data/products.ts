export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  originalPrice: number;
  status: string;
  code: string;
  colors: string[];
  sizes: string[];
  thumbnail: string;
  images: string[];
}

export const products: Product[] = [
  {
    id: 'DOLA3900',
    name: 'QUẦN DÀI ỐNG SUÔNG',
    brand: 'Dola Style',
    price: 299000,
    category: 'Quần',
    originalPrice: 500000,
    status: 'Còn hàng',
    code: 'DOLA3900',
    colors: ['trang', 'den'],
    sizes: ['S', 'M', 'L'],
    thumbnail: '/assets/images/xanh.webp',
    images: ['/assets/images/xanh1.webp', '/assets/images/xanh.webp', '/assets/images/xanh1.webp'],
  },
];
