import type { ModelDef } from "../types/modelBuilder";
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

export const fetchAllModels = (): Promise<ModelDef[]> =>
  api.get("/meta/models");

export const fetchModelDef = (name: string): Promise<ModelDef> =>
  api.get(`/meta/models/${name}`);

export const createModelDef = (
  data: Omit<ModelDef, "_id">
): Promise<ModelDef> =>
  api.post("/meta/models", data);

export const updateModelDef = (
  name: string,
  data: Partial<ModelDef>
): Promise<ModelDef> =>
  api.put(`/meta/models/${name}`, data);

export const deleteModelDef = (
  name: string,
  deleteData = false
): Promise<void> =>
  api.delete(`/meta/models/${name}`, {
    params: { deleteData },
  });