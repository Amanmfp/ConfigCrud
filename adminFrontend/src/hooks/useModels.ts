import { useQuery } from "@tanstack/react-query";
 
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
 
export type ModelMeta = {
  _id?:   string;
  name:   string;
  label:  string;
  icon?:  string;
};
 
export const useModels = () =>
  useQuery<ModelMeta[]>({
    queryKey: ["models"],
    queryFn:  () => fetch(`${BASE}/models`).then((r) => r.json()),
    staleTime: 30_000,
    gcTime:    5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
 