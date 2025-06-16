import { DataProvider, RaRecord, GetListResult, GetOneResult, GetManyResult, UpdateParams, CreateParams, DeleteParams } from 'react-admin';

export const mockOrders = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    status: "pending",
    total: 1500000,
    createdAt: "2025-06-01T08:00:00Z",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    status: "shipping",
    total: 2300000,
    createdAt: "2025-06-02T10:15:00Z",
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    status: "completed",
    total: 980000,
    createdAt: "2025-06-03T09:30:00Z",
  },
  {
    id: 4,
    customerName: "Phạm Thị D",
    status: "cancelled",
    total: 1750000,
    createdAt: "2025-06-03T14:45:00Z",
  },
  {
    id: 5,
    customerName: "Hoàng Văn E",
    status: "pending",
    total: 1120000,
    createdAt: "2025-06-04T11:00:00Z",
  },
  {
    id: 6,
    customerName: "Ngô Thị F",
    status: "completed",
    total: 2150000,
    createdAt: "2025-06-04T13:30:00Z",
  },
  {
    id: 7,
    customerName: "Đỗ Văn G",
    status: "shipping",
    total: 1490000,
    createdAt: "2025-06-04T15:00:00Z",
  },
  {
    id: 8,
    customerName: "Mai Thị H",
    status: "cancelled",
    total: 1890000,
    createdAt: "2025-06-04T17:20:00Z",
  },
  {
    id: 9,
    customerName: "Vũ Văn I",
    status: "completed",
    total: 1210000,
    createdAt: "2025-06-04T18:45:00Z",
  },
  {
    id: 10,
    customerName: "Phan Thị K",
    status: "pending",
    total: 1650000,
    createdAt: "2025-06-04T20:00:00Z",
  },
];


const products = [
  {
    "id": "DOLA3900",
    "name": "QUẦN DÀI ỐNG SUÔNG",
    "brand": "Dola Style",
    "price": 299000,
    "category": "Quần",
    "originalPrice": 500000,
    "status": true,
    "colors": [
      "#fff",
      "#000"
    ],
    "type": "quần",
    "style": "trẻ trung",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "sold": 10,
    "total": 50,
    "thumbnail": "/assets/images/xanh.webp",
    "images": [
      "/assets/images/xanh1.webp",
      "/assets/images/kem.jpg",
      "/assets/images/xanh.webp"
    ],
    "sale": false,
    "delivery": "free",
    "createdAt": "2025-05-01"
  },
  {
    "id": "DOLA3901",
    "name": "QUẦN DÀI ỐNG SUÔNG",
    "brand": "Dola Style",
    "price": 199000,
    "category": "Quần",
    "originalPrice": 500000,
    "status": true,
    "colors": [
      "#f00",
      "#0f0"
    ],
    "type": "quần",
    "style": "gợi cảm",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "sold": 11,
    "total": 52,
    "thumbnail": "/assets/images/xanh.webp",
    "images": [
      "/assets/images/xanh1.webp",
      "/assets/images/kem.jpg",
      "/assets/images/xanh.webp"
    ],
    "sale": true,
    "delivery": "standard",
    "createdAt": "2025-05-02"
  },
  {
    "id": "DOLA3902",
    "name": "QUẦN DÀI ỐNG SUÔNG",
    "brand": "Dola Style",
    "price": 299000,
    "category": "Quần",
    "originalPrice": 500000,
    "status": true,
    "colors": [
      "#f00",
      "#0f0"
    ],
    "type": "quần",
    "style": "gợi cảm",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "sold": 12,
    "total": 54,
    "thumbnail": "/assets/images/xanh.webp",
    "images": [
      "/assets/images/xanh1.webp",
      "/assets/images/kem.jpg",
      "/assets/images/xanh.webp"
    ],
    "sale": false,
    "delivery": "free",
    "createdAt": "2025-05-03"
  },
  {
    "id": "DOLA3903",
    "name": "QUẦN DÀI ỐNG SUÔNG",
    "brand": "Dola Style",
    "price": 199000,
    "category": "Quần",
    "originalPrice": 500000,
    "status": true,
    "colors": [
      "#fff",
      "#000"
    ],
    "type": "quần",
    "style": "trẻ trung",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "sold": 13,
    "total": 56,
    "thumbnail": "/assets/images/xanh.webp",
    "images": [
      "/assets/images/xanh1.webp",
      "/assets/images/kem.jpg",
      "/assets/images/xanh.webp"
    ],
    "sale": true,
    "delivery": "standard",
    "createdAt": "2025-05-04"
  },
    {
    "id": "DOLA3904",
    "name": "QUẦN DÀI ỐNG SUÔNG",
    "brand": "Dola Style",
    "price": 199000,
    "category": "Quần",
    "originalPrice": 500000,
    "status": true,
    "colors": [
      "#fff",
      "#000"
    ],
    "type": "quần",
    "style": "trẻ trung",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "sold": 13,
    "total": 56,
    "thumbnail": "/assets/images/xanh.webp",
    "images": [
      "/assets/images/xanh1.webp",
      "/assets/images/kem.jpg",
      "/assets/images/xanh.webp"
    ],
    "sale": true,
    "delivery": "standard",
    "createdAt": "2025-05-04T00:00:00"
  },
    {
    "id": "DOLA3905",
    "name": "QUẦN DÀI ỐNG SUÔNG",
    "brand": "Dola Style",
    "price": 199000,
    "category": "Quần",
    "originalPrice": 500000,
    "status": true,
    "colors": [
      "#fff",
      "#000"
    ],
    "type": "quần",
    "style": "trẻ trung",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "sold": 13,
    "total": 56,
    "thumbnail": "/assets/images/xanh.webp",
    "images": [
      "/assets/images/xanh1.webp",
      "/assets/images/kem.jpg",
      "/assets/images/xanh.webp"
    ],
    "sale": true,
    "delivery": "standard",
    "createdAt": "2025-05-04T00:00:00"
  },
    {
    "id": "DOLA3906",
    "name": "QUẦN DÀI ỐNG SUÔNG",
    "brand": "Dola Style",
    "price": 199000,
    "category": "Quần",
    "originalPrice": 500000,
    "status": true,
    "colors": [
      "#fff",
      "#000"
    ],
    "type": "quần",
    "style": "trẻ trung",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "sold": 13,
    "total": 56,
    "thumbnail": "/assets/images/xanh.webp",
    "images": [
      "/assets/images/xanh1.webp",
      "/assets/images/kem.jpg",
      "/assets/images/xanh.webp"
    ],
    "sale": true,
    "delivery": "standard",
    "createdAt": "2025-05-04T00:00:00"
  },
];

const fakeDataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord = any>(
    resource: string,
    _params: any
  ): Promise<GetListResult<RecordType>> => {
    if (resource === 'products') {
      return {
        data: products as unknown as RecordType[],
        total: products.length,
      };
    }
    if (resource === 'orders') {
      return {
        data: mockOrders as unknown as RecordType[],
        total: mockOrders.length,
      };
    }
    return { data: [] as RecordType[], total: 0 };
  },

  getOne: async <RecordType extends RaRecord = any>(
    resource: string,
    params: { id: string | number } & any
  ): Promise<GetOneResult<RecordType>> => {
    const id = params.id.toString();
    if (resource === 'products') {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return { data: product as unknown as RecordType };
    }
    if (resource === 'orders') {
      const order = mockOrders.find(o => o.id.toString() === id);
      if (!order) throw new Error('Order not found');
      return { data: order as unknown as RecordType };
    }
    throw new Error('Unknown resource');
  },

  getMany: async <RecordType extends RaRecord = any>(
    resource: string,
    params: { ids: (string | number)[] } & any
  ): Promise<GetManyResult<RecordType>> => {
    const ids = params.ids.map((id: string | number) => id.toString());
    if (resource === 'products') {
      const result = products.filter(p => ids.includes(p.id));
      return { data: result as unknown as RecordType[] };
    }
    if (resource === 'orders') {
      const result = mockOrders.filter(o => ids.includes(o.id.toString()));
      return { data: result as unknown as RecordType[] };
    }
    return { data: [] as RecordType[] };
  },

  getManyReference: async () => ({ data: [], total: 0 }),

  update: async <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateParams<RecordType>
  ): Promise<{ data: RecordType }> => {
    const id = params.id.toString();
    if (resource === 'products') {
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      products[index] = { ...products[index], ...params.data };
      return { data: products[index] as unknown as RecordType };
    }
    if (resource === 'orders') {
      const index = mockOrders.findIndex(o => o.id.toString() === id);
      if (index === -1) throw new Error('Order not found');
      mockOrders[index] = { ...mockOrders[index], ...params.data };
      return { data: mockOrders[index] as unknown as RecordType };
    }
    throw new Error('Unknown resource');
  },

  updateMany: async () => ({ data: [] }),

  create: async <RecordType extends RaRecord = any>(
    resource: string,
    params: CreateParams<RecordType>
  ): Promise<{ data: RecordType }> => {
    if (resource === 'products') {
      const newId = `DOLA${(products.length + 3900).toString().padStart(4, '0')}`;
      const newProduct = { 
        id: newId, 
        name: '',
        brand: '',
        price: 0,
        category: '',
        originalPrice: 0,
        status: true,
        colors: [],
        type: '',
        style: '',
        sizes: [],
        sold: 0,
        total: 0,
        thumbnail: '',
        images: [],
        sale: false,
        delivery: 'standard',
        createdAt: new Date().toISOString(),
        ...params.data 
      };
      products.push(newProduct);
      return { data: newProduct as unknown as RecordType };
    }
    if (resource === 'orders') {
      const newId = mockOrders.length + 1;
      const newOrder = { 
        id: newId, 
        customerName: '',
        status: 'pending',
        total: 0,
        createdAt: new Date().toISOString(),
        ...params.data 
      };
      mockOrders.push(newOrder);
      return { data: newOrder as unknown as RecordType };
    }
    throw new Error('Unknown resource');
  },

  delete: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<{ data: RecordType }> => {
    const id = params.id.toString();
    if (resource === 'products') {
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      const deleted = products.splice(index, 1)[0];
      return { data: deleted as unknown as RecordType };
    }
    if (resource === 'orders') {
      const index = mockOrders.findIndex(o => o.id.toString() === id);
      if (index === -1) throw new Error('Order not found');
      const deleted = mockOrders.splice(index, 1)[0];
      return { data: deleted as unknown as RecordType };
    }
    throw new Error('Unknown resource');
  },

  deleteMany: async () => ({ data: [] }),
};

export default fakeDataProvider;
