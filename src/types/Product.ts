export interface Product {
    _id: string;
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    type: string;
    status: 'selling' | 'stopped' | 'sold_out'
    colors: string[];
    style: string;
    sizes: string[];
    sold: number;
    total: number;
    thumbnail: string;
    images: string[];
    sale: boolean;
    createdAt: string;
    description?: string;
    details?: string;
    rating?: number;
}