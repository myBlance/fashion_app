import simpleRestProvider from "ra-data-simple-rest";
import {
  fetchUtils,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  UpdateParams,
  CreateParams,
  DeleteParams,
} from "react-admin";
import { stringify } from "query-string";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
const baseProvider = simpleRestProvider(baseUrl, fetchUtils.fetchJson);

/**
 * 🧠 DataProvider tuỳ chỉnh cho backend Node.js + MongoDB
 * Hỗ trợ upload file, mảng, và parse dữ liệu an toàn
 */
const dataProvider = {
  ...baseProvider,

  /** 🔹 LẤY DANH SÁCH (GET LIST) */
  async getList(resource: string, params: GetListParams): Promise<GetListResult<any>> {
    const page = params.pagination?.page || 1;
    const perPage = params.pagination?.perPage || 10;
    const field = params.sort?.field || "createdAt";
    const order = params.sort?.order || "DESC";

    const query = {
      _start: (page - 1) * perPage,
      _end: page * perPage,
      _sort: field,
      _order: order,
      ...params.filter,
    };

    const url = `${baseUrl}/${resource}?${stringify(query)}`;
    const response = await fetchUtils.fetchJson(url);

    const contentRange = response.headers.get("Content-Range");
    const total = contentRange
      ? parseInt(contentRange.split("/").pop() || "0", 10)
      : response.json.length;

    const data = (Array.isArray(response.json) ? response.json : [response.json]).map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));

    return { data, total };
  },

  /** 🔹 LẤY MỘT BẢN GHI (GET ONE) */
  async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const response = await fetchUtils.fetchJson(url);
    const item = response.json;
    return { data: { ...item, id: item.id || item._id } };
  },

  /** 🔹 TẠO MỚI (CREATE) */
  async create(resource: string, params: CreateParams): Promise<{ data: any }> {
    const formData = new FormData();

    Object.entries(params.data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // gửi mảng dạng JSON
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    if (params.data.thumbnail?.rawFile) {
      formData.append("thumbnail", params.data.thumbnail.rawFile);
    }

    if (Array.isArray(params.data.images)) {
      params.data.images.forEach((img: any) => {
        if (img.rawFile) formData.append("images", img.rawFile);
      });
    }

    const response = await fetchUtils.fetchJson(`${baseUrl}/${resource}`, {
      method: "POST",
      body: formData,
    });

    const item = response.json;
    return { data: { ...item, id: item.id || item._id } };
  },

  /** 🔹 CẬP NHẬT (UPDATE) */
  async update(resource: string, params: UpdateParams): Promise<{ data: any }> {
    const formData = new FormData();

    Object.entries(params.data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // gửi mảng dạng JSON
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    // Nếu có file mới
    if (params.data.thumbnail?.rawFile) {
      formData.append("thumbnail", params.data.thumbnail.rawFile);
    }

    if (Array.isArray(params.data.images)) {
      params.data.images.forEach((img: any) => {
        if (img.rawFile) formData.append("images", img.rawFile);
      });
    }

    const response = await fetchUtils.fetchJson(`${baseUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: formData,
    });

    const item = response.json;
    return { data: { ...item, id: item.id || item._id } };
  },

  /** 🔹 XOÁ (DELETE) */
  async delete(resource: string, params: DeleteParams): Promise<{ data: any }> {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const response = await fetchUtils.fetchJson(url, { method: "DELETE" });
    return { data: response.json };
  },
};

export default dataProvider;
