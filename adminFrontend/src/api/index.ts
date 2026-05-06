import axios from "axios";

// const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const BASE = "https://configcrud.onrender.com/api";

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.error || err.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

// APIs
export const fetchModels = () => api.get("/models");

export const fetchSchema = (model: string) =>
  api.get(`/schema/${model}`);

export const fetchData = (
  model: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: string;
  }
): Promise<any> =>
  api.get(`/${model}`, {
    params, 
  });

export const fetchItem = (model: string, id: string) =>
  api.get(`/${model}/${id}`);

export const createItem = (model: string, data: any) =>
  api.post(`/${model}`, data);

export const updateItem = (model: string, id: string, data: any) =>
  api.put(`/${model}/${id}`, data);

export const deleteItem = (model: string, id: string) =>
  api.delete(`/${model}/${id}`);