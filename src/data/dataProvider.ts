import simpleRestProvider from 'ra-data-simple-rest';
import { fetchUtils, GetListParams, GetListResult, GetOneParams, GetOneResult, UpdateParams, CreateParams, DeleteParams } from 'react-admin';
import { stringify } from 'query-string';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;

const customDataProvider = simpleRestProvider(baseUrl, fetchUtils.fetchJson);

const dataProvider = {
  ...customDataProvider,

  // GET LIST
  getList: async (resource: string, params: GetListParams): Promise<GetListResult> => {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;
    const field = params.sort?.field || 'id';
    const order = params.sort?.order || 'ASC';

    const query = {
      _start: (page - 1) * perPage,
      _end: page * perPage,
      _sort: field,
      _order: order,
      ...params.filter,
    };

    const url = `${baseUrl}/${resource}?${stringify(query)}`;

    const response = await fetchUtils.fetchJson(url, {
      credentials: 'include',
    });

    const total = parseInt(response.headers.get('Content-Range')?.split('/')?.[1] || '0', 10);

    return {
      data: response.json,
      total,
    };
  },

  // GET ONE
  getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const response = await fetchUtils.fetchJson(url);
    return { data: response.json };
  },

  // CREATE
create: async (resource: string, params: CreateParams): Promise<{ data: any }> => {
    // Chuẩn bị dữ liệu đúng định dạng backend cần
    const productData = {
        name: params.data.name,
        brand: params.data.brand,
        price: Number(params.data.price),
        originalPrice: Number(params.data.originalPrice || params.data.price), // Nếu không có originalPrice thì dùng price
        category: params.data.category,
        type: params.data.type,
        style: params.data.style,
        delivery: params.data.delivery,
        colors: Array.isArray(params.data.colors) ? params.data.colors : [],
        sizes: Array.isArray(params.data.sizes) ? params.data.sizes : [],
        total: Number(params.data.total) || 0,
        sold: Number(params.data.sold) || 0,
        status: params.data.status || 'selling',
        // Xử lý ảnh tạm thời
        thumbnail: params.data.thumbnail?.src || 'default-thumbnail.jpg',
        images: params.data.images ? [params.data.images.src] : ['default-image.jpg']
    };

    console.log('Dữ liệu gửi đi:', JSON.stringify(productData, null, 2));

    try {
        const response = await fetchUtils.fetchJson(`${baseUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(productData),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        });
        return { data: response.json };
    } catch (error) {
        console.error('Chi tiết lỗi:', error);
        let errorMessage = 'Không thể tạo sản phẩm';
        if (error && typeof error === 'object' && 'message' in error) {
            errorMessage += `: ${(error as { message: string }).message}`;
        }
        throw new Error(errorMessage);
    }
},



  // UPDATE
  update: async (resource: string, params: UpdateParams): Promise<{ data: any }> => {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const response = await fetchUtils.fetchJson(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });

    return {
      data: response.json,
    };
  },

  // DELETE
  delete: async (resource: string, params: DeleteParams): Promise<{ data: any }> => {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const response = await fetchUtils.fetchJson(url, {
      method: 'DELETE',
    });

    return {
      data: response.json,
    };
  },
};

export default dataProvider;
