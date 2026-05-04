import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getSchema = async (model: string) => {
  const res = await api.get(`/schema/${model}`);
  return res.data;
};

export const getList = async (model: string) => {
  const res = await api.get(`/${model}`);
  return res.data;
};

export const createItem = async (model: string, data: any) => {
  const res = await api.post(`/${model}`, data);
  return res.data;
};

export const updateItem = async (
  model: string,
  id: number,
  data: any
) => {
  const res = await api.put(`/${model}/${id}`, data);
  return res.data;
};

export const deleteItem = async (model: string, id: number) => {
  const res = await api.delete(`/${model}/${id}`);
  return res.data;
};