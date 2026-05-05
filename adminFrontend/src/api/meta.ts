import type { ModelDef } from "../types/modelBuilder";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
 
export const fetchAllModels = (): Promise<ModelDef[]> =>
  fetch(`${BASE}/meta/models`).then((r) => r.json());
 
export const fetchModelDef = (name: string): Promise<ModelDef> =>
  fetch(`${BASE}/meta/models/${name}`).then((r) => r.json());
 
export const createModelDef = (data: Omit<ModelDef, "_id">): Promise<ModelDef> =>
  fetch(`${BASE}/meta/models`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  }).then((r) => r.json());
 
export const updateModelDef = (name: string, data: Partial<ModelDef>): Promise<ModelDef> =>
  fetch(`${BASE}/meta/models/${name}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  }).then((r) => r.json());
 
export const deleteModelDef = (name: string, deleteData = false): Promise<void> =>
  fetch(`${BASE}/meta/models/${name}?deleteData=${deleteData}`, {
    method: "DELETE",
  }).then((r) => r.json());
 