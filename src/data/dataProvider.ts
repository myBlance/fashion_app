// src/data/dataProvider.ts
import {
  fetchUtils,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  UpdateParams,
  CreateParams,
  DeleteParams,
  GetManyParams,
  GetManyResult,
  GetManyReferenceParams,
  GetManyReferenceResult,
  UpdateManyParams,
  UpdateManyResult,
  DeleteManyParams,
  DeleteManyResult,
  CreateResult,
  UpdateResult,
  DeleteResult,
} from "react-admin";
import { stringify } from "query-string";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;

const httpClient = (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, { ...options, headers });
};

const dataProvider = {
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
    const response = await httpClient(url);

    // 🔹 Lấy data từ response.json.data nếu backend trả dạng { success, data }
    const rawData = Array.isArray(response.json)
      ? response.json
      : Array.isArray(response.json.data)
      ? response.json.data
      : [];

    const data = rawData.map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));

    const total =
      response.headers.get("Content-Range")?.split("/")?.pop() ||
      data.length;

    return { data, total: Number(total) };
  },

  /** 🔹 LẤY MỘT BẢN GHI (GET ONE) */
  async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const response = await httpClient(url);

    const item = response.json.data || response.json;
    return { data: { ...item, id: item.id || item._id } };
  },

  /** 🔹 TẠO MỚI (CREATE) */
  async create(resource: string, params: CreateParams): Promise<CreateResult> {
    const hasFile =
      params.data.thumbnail?.rawFile ||
      (Array.isArray(params.data.images) && params.data.images.some((img: any) => img.rawFile));

    if (hasFile) {
      const formData = new FormData();
      Object.entries(params.data).forEach(([key, value]) => {
        if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
        else if (value !== undefined && value !== null) formData.append(key, value as any);
      });
      if (params.data.thumbnail?.rawFile) formData.append("thumbnail", params.data.thumbnail.rawFile);
      if (Array.isArray(params.data.images))
        params.data.images.forEach((img: any) => {
          if (img.rawFile) formData.append("images", img.rawFile);
        });

      const response = await httpClient(`${baseUrl}/${resource}`, { method: "POST", body: formData });
      const item = response.json.data || response.json;
      return { data: { ...item, id: item.id || item._id } };
    } else {
      const token = localStorage.getItem("token");
      const headers = new Headers({ "Content-Type": "application/json" });
      if (token) headers.set("Authorization", `Bearer ${token}`);

      const response = await fetch(`${baseUrl}/${resource}`, {
        method: "POST",
        headers,
        body: JSON.stringify(params.data),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const item = await response.json();
      return { data: { ...item.data || item, id: (item.data?.id || item.id || item._id) } };
    }
  },

  /** 🔹 CẬP NHẬT (UPDATE) */
  async update(resource: string, params: UpdateParams): Promise<UpdateResult> {
    const formData = new FormData();
    Object.entries(params.data).forEach(([key, value]) => {
      if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
      else if (value !== undefined && value !== null) formData.append(key, value as any);
    });
    if (params.data.thumbnail?.rawFile) formData.append("thumbnail", params.data.thumbnail.rawFile);
    if (Array.isArray(params.data.images))
      params.data.images.forEach((img: any) => {
        if (img.rawFile) formData.append("images", img.rawFile);
      });

    const response = await httpClient(`${baseUrl}/${resource}/${params.id}`, { method: "PUT", body: formData });
    const item = response.json.data || response.json;
    return { data: { ...item, id: item.id || item._id } };
  },

  /** 🔹 XOÁ (DELETE) */
  async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
    const url = `${baseUrl}/${resource}/${params.id}`;
    const response = await httpClient(url, { method: "DELETE" });
    const item = response.json.data || response.json;
    return { data: item };
  },

  /** 🔹 GET MANY */
  async getMany(resource: string, params: GetManyParams): Promise<GetManyResult> {
    const query = { filter: JSON.stringify({ id: params.ids }) };
    const url = `${baseUrl}/${resource}?${stringify(query)}`;
    const response = await httpClient(url);
    const rawData = Array.isArray(response.json) ? response.json : response.json.data || [];
    const data = rawData.map((item: any) => ({ ...item, id: item.id || item._id }));
    return { data };
  },

  /** 🔹 GET MANY REFERENCE */
  async getManyReference(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult> {
    const { target, id, pagination, sort, filter } = params;
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;
    const field = sort?.field || "createdAt";
    const order = sort?.order || "DESC";

    const query = {
      _start: (page - 1) * perPage,
      _end: page * perPage,
      _sort: field,
      _order: order,
      ...filter,
      [target]: id,
    };

    const url = `${baseUrl}/${resource}?${stringify(query)}`;
    const response = await httpClient(url);

    const rawData = Array.isArray(response.json) ? response.json : response.json.data || [];
    const data = rawData.map((item: any) => ({ ...item, id: item.id || item._id }));
    const total = response.headers.get("Content-Range")?.split("/")?.pop() || data.length;

    return { data, total: Number(total) };
  },

  async updateMany(resource: string, params: UpdateManyParams): Promise<UpdateManyResult> {
    const responses = await Promise.all(
      params.ids.map(id =>
        httpClient(`${baseUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
          headers: new Headers({ "Content-Type": "application/json" }),
        })
      )
    );
    return { data: responses.map(r => r.json.data?.id || r.json.id) };
  },

  async deleteMany(resource: string, params: DeleteManyParams): Promise<DeleteManyResult> {
    const responses = await Promise.all(
      params.ids.map(id => httpClient(`${baseUrl}/${resource}/${id}`, { method: "DELETE" }))
    );
    return { data: responses.map(r => r.json.data?.id || r.json.id) };
  },
};

export default dataProvider;
