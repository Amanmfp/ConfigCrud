import type { ModelDef } from "../types/modelBuilder";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
 
const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    const msg =
      data?.error ??
      (Array.isArray(data?.details) ? data.details.join("\n") : null) ??
      "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const fetchAllModels = (): Promise<ModelDef[]> =>
  fetch(`${BASE}/meta/models`).then(handleResponse);
 
export const fetchModelDef = (name: string): Promise<ModelDef> =>
  fetch(`${BASE}/meta/models/${name}`).then(handleResponse);
 
export const createModelDef = (data: Omit<ModelDef, "_id">): Promise<ModelDef> =>
  fetch(`${BASE}/meta/models`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  }).then(handleResponse);
 
export const updateModelDef = (name: string, data: Partial<ModelDef>): Promise<ModelDef> =>
  fetch(`${BASE}/meta/models/${name}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  }).then(handleResponse);
 
export const deleteModelDef = (name: string, deleteData = false): Promise<void> =>
  fetch(`${BASE}/meta/models/${name}?deleteData=${deleteData}`, {
    method: "DELETE",
  }).then(handleResponse);
 