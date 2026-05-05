// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000",
//   // baseURL: "https://configcrud.onrender.com"
// });

// export const getSchema = async (model: string) => {
//   const res = await api.get(`/schema/${model}`);
//   return res.data;
// };

// export const getList = async (model: string) => {
//   const res = await api.get(`/${model}`);
//   return res.data;
// };

// export const createItem = async (model: string, data: any) => {
//   const res = await api.post(`/${model}`, data);
//   return res.data;
// };

// export const updateItem = async (
//   model: string,
//   id: number,
//   data: any
// ) => {
//   const res = await api.put(`/${model}/${id}`, data);
//   return res.data;
// };

// export const deleteItem = async (model: string, id: number) => {
//   const res = await api.delete(`/${model}/${id}`);
//   return res.data;
// };

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
 
const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
};
 
export const fetchModels  = () =>
  fetch(`${BASE}/models`).then(handleResponse);
 
export const fetchSchema  = (model: string) =>
  fetch(`${BASE}/schema/${model}`).then(handleResponse);
 
export const fetchData    = (model: string, params = "") =>
  fetch(`${BASE}/${model}${params}`).then(handleResponse);
 
export const createItem   = (model: string, data: any) =>
  fetch(`${BASE}/${model}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  }).then(handleResponse);
 
export const updateItem   = (model: string, id: string, data: any) =>
  // ← id is string (MongoDB _id), not number
  fetch(`${BASE}/${model}/${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  }).then(handleResponse);
 
export const deleteItem   = (model: string, id: string) =>
  fetch(`${BASE}/${model}/${id}`, { method: "DELETE" }).then(handleResponse);