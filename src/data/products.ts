export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  originalPrice: number;
  status: boolean;
  code: string;
  colors: string[];
  sizes: string[];
  sold: number;
  total: number;
  thumbnail: string;
  images: string[];
  label: string;
  delivery: string,

}

export const products: Product[] = [
  {
    id: 'DOLA3900',
    name: 'QUẦN DÀI ỐNG SUÔNG',
    brand: 'Dola Style',
    price: 299000,
    category: 'Quần',
    originalPrice: 500000,
    status: true,
    code: 'DOLA3900',
    colors: ['#fff', '#000'],
    sizes: ['S', 'M', 'L'],
    sold: 14,
    total: 50,
    label: 'Khuyến mãi đặc biệt',
    thumbnail: '/assets/images/xanh.webp',
    images: ['/assets/images/xanh1.webp', '/assets/images/kem.jpg', '/assets/images/xanh.webp'],
    delivery: "free",
  },
  {
    id: 'DOLA3901',
    name: 'QUẦN DÀI ỐNG SUÔNG',
    brand: 'Dola Style',
    price: 299000,
    category: 'Quần',
    originalPrice: 500000,
    status: true,
    code: 'DOLA3900',
    colors: ['#fff', '#000'],
    sizes: ['S', 'M', 'L'],
    sold: 14,
    total: 55,
    label: 'Khuyến mãi đặc biệt',
    thumbnail: '/assets/images/xanh.webp',
    images: ['/assets/images/xanh1.webp', '/assets/images/kem.jpg', '/assets/images/xanh.webp'],
    delivery: "free",
  },
  {
    id: 'DOLA3902',
    name: 'QUẦN DÀI ỐNG SUÔNG',
    brand: 'Dola Style',
    price: 299000,
    category: 'Quần',
    originalPrice: 500000,
    status: true,
    code: 'DOLA3900',
    colors: ['#fff', '#000'],
    sizes: ['S', 'M', 'L'],
    sold: 14,
    total: 15,
    label: 'Khuyến mãi đặc biệt',
    thumbnail: '/assets/images/xanh.webp',
    images: ['/assets/images/xanh1.webp', '/assets/images/kem.jpg', '/assets/images/xanh.webp'],
    delivery: "free",
  },
  {
    id: 'DOLA3903',
    name: 'QUẦN DÀI ỐNG SUÔNG',
    brand: 'Dola Style',
    price: 299000,
    category: 'Quần',
    originalPrice: 500000,
    status: true,
    code: 'DOLA3900',
    colors: ['#fff', '#000'],
    sizes: ['S', 'M', 'L'],
    sold: 14,
    total: 50,
    label: 'Khuyến mãi đặc biệt',
    thumbnail: '/assets/images/xanh.webp',
   images: ['/assets/images/xanh1.webp', '/assets/images/kem.jpg', '/assets/images/xanh.webp'],
   delivery: "free",
  },
  {
    id: 'DOLA3904',
    name: 'QUẦN DÀI ỐNG SUÔNG',
    brand: 'Dola Style',
    price: 199000,
    category: 'Quần',
    originalPrice: 500000,
    status: true,
    code: 'DOLA3900',
    colors: ['#fff', '#000'],
    sizes: ['S', 'M', 'L'],
    sold: 14,
    total: 50,
    label: 'Khuyến mãi đặc biệt',
    thumbnail: '/assets/images/xanh.webp',
    images: ['/assets/images/xanh1.webp', '/assets/images/kem.jpg', '/assets/images/xanh.webp'],
    delivery: "free",
  },
  {
    id: 'DOLA3905',
    name: 'QUẦN DÀI ỐNG SUÔNG',
    brand: 'Dola Style',
    price: 99000,
    category: 'Quần',
    originalPrice: 500000,
    status: true,
    code: 'DOLA3900',
    colors: ['#fff', '#000'],
    sizes: ['S', 'M', 'L'],
    sold: 14,
    total: 50,
    label: 'Khuyến mãi đặc biệt',
    thumbnail: '/assets/images/xanh.webp',
    images: ['/assets/images/xanh1.webp', '/assets/images/kem.jpg', '/assets/images/xanh.webp'],
    delivery: "free",
  },
];
