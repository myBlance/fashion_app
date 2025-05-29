import { DataProvider, RaRecord, GetListResult } from 'react-admin';

const mockOrders = [
  { id: 'ORD001', customer: 'Nguyễn Văn A', total: 1500000, status: 'Đã thanh toán', date: '2025-05-25' },
  { id: 'ORD002', customer: 'Trần Thị B', total: 2750000, status: 'Chờ xử lý', date: '2025-05-26' },
  { id: 'ORD003', customer: 'Lê Văn C', total: 980000, status: 'Đã hủy', date: '2025-05-27' },
];

const products = [
  { id: 1, name: 'Áo thun', price: 150000, stock: 20 },
  { id: 2, name: 'Quần jean', price: 300000, stock: 15 },
  { id: 3, name: 'Giày thể thao', price: 500000, stock: 10 },
];

const fakeDataProvider: DataProvider = {
  getList: <RecordType extends RaRecord = any>(resource: string, params: any): Promise<GetListResult<RecordType>> => {
    if (resource === 'products') {
      return Promise.resolve({
        data: products as unknown as RecordType[],
        total: products.length,
      });
    }
    if (resource === 'orders') {
      return Promise.resolve({
        data: mockOrders as unknown as RecordType[],
        total: mockOrders.length,
      });
    }
    return Promise.resolve({ data: [] as RecordType[], total: 0 });
  },

  getOne: <RecordType extends RaRecord = any>(resource: string, params: any): Promise<{ data: RecordType }> => {
    if (resource === 'products') {
      const product = products.find(p => p.id === params.id);
      return Promise.resolve({ data: product as unknown as RecordType });
    }
    if (resource === 'orders') {
      const order = mockOrders.find(o => o.id === params.id);
      return Promise.resolve({ data: order as unknown as RecordType });
    }
    return Promise.reject('Unknown resource');
  },

  getMany: <RecordType extends RaRecord = any>(resource: string, params: any): Promise<{ data: RecordType[] }> => {
    if (resource === 'products') {
      const result = products.filter(p => params.ids.includes(p.id));
      return Promise.resolve({ data: result as unknown as RecordType[] });
    }
    if (resource === 'orders') {
      const result = mockOrders.filter(o => params.ids.includes(o.id));
      return Promise.resolve({ data: result as unknown as RecordType[] });
    }
    return Promise.resolve({ data: [] as RecordType[] });
  },

  getManyReference: () => Promise.resolve({ data: [], total: 0 }),

  update: <RecordType extends RaRecord = any>(resource: string, params: any): Promise<{ data: RecordType }> => {
    if (resource === 'products') {
      const index = products.findIndex(p => p.id === params.id);
      if (index > -1) {
        products[index] = { ...products[index], ...params.data };
        return Promise.resolve({ data: products[index] as unknown as RecordType });
      }
    }
    if (resource === 'orders') {
      const index = mockOrders.findIndex(o => o.id === params.id);
      if (index > -1) {
        mockOrders[index] = { ...mockOrders[index], ...params.data };
        return Promise.resolve({ data: mockOrders[index] as unknown as RecordType });
      }
    }
    return Promise.reject('Not found');
  },

  updateMany: () => Promise.resolve({ data: [] }),

  create: <RecordType extends RaRecord = any>(resource: string, params: any): Promise<{ data: RecordType }> => {
    if (resource === 'products') {
      const newProduct = { id: products.length + 1, ...params.data };
      products.push(newProduct);
      return Promise.resolve({ data: newProduct as unknown as RecordType });
    }
    if (resource === 'orders') {
      const newId = 'ORD' + String(mockOrders.length + 1).padStart(3, '0');
      const newOrder = { id: newId, ...params.data };
      mockOrders.push(newOrder);
      return Promise.resolve({ data: newOrder as unknown as RecordType });
    }
    return Promise.reject('Unknown resource');
  },

  delete: <RecordType extends RaRecord = any>(resource: string, params: any): Promise<{ data: RecordType }> => {
    if (resource === 'products') {
      const index = products.findIndex(p => p.id === params.id);
      if (index > -1) {
        const deleted = products.splice(index, 1)[0];
        return Promise.resolve({ data: deleted as unknown as RecordType });
      }
    }
    if (resource === 'orders') {
      const index = mockOrders.findIndex(o => o.id === params.id);
      if (index > -1) {
        const deleted = mockOrders.splice(index, 1)[0];
        return Promise.resolve({ data: deleted as unknown as RecordType });
      }
    }
    return Promise.reject('Not found');
  },

  deleteMany: () => Promise.resolve({ data: [] }),
};

export default fakeDataProvider;
