import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/products';

export interface Product {
    _id: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  category: string;
  status: string;
  colors: string[];
  type: string;
  style: string;
  sizes: string[];
  sold: number;
  total: number;
  thumbnail: string;
  images: string[];
  sale: boolean;
  delivery: string;
  createdAt: string;
  description?: string;
    details?: string;
}

// Lấy danh sách sản phẩm với phân trang, lọc, sắp xếp
export const getProducts = async (
  _start = 0,
  _end = 10,
  _sort = 'createdAt',
  _order: 'ASC' | 'DESC' = 'DESC',
  filters: Record<string, string> = {}
) => {
  const params: Record<string, any> = { _start, _end, _sort, _order, ...filters };
  const res = await axios.get<Product[]>(`${API_URL}/api/products`, { params });
  const total = Number(res.headers['content-range']?.split('/')[1] || res.data.length);
  return { data: res.data, total };
};

// Lấy sản phẩm theo ID
export const getProductById = async (id: string) => {
  const res = await axios.get<Product>(`${API_URL}/api/products/${id}`);
  return res.data;
};

// Thêm sản phẩm mới
export const createProduct = async (product: Partial<Product>) => {
  const res = await axios.post<Product>(`${API_URL}/api/products`, product);
  return res.data;
};

// Cập nhật sản phẩm
export const updateProduct = async (id: string, product: Partial<Product>) => {
  const res = await axios.put<Product>(`${API_URL}/api/products/${id}`, product);
  return res.data;
};

// Xoá sản phẩm
export const deleteProduct = async (id: string) => {
  const res = await axios.delete(`${API_URL}/api/products/${id}`);
  return res.data;
};
