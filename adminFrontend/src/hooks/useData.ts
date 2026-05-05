// import { useQuery } from "@tanstack/react-query";
// import { getList } from "../api";

// export const useData = (model: string) => {
//   return useQuery<Record<string, any>[]>({
//     queryKey: ["data", model],
//     queryFn: () => getList(model),
//   });
// };

import { useQuery } from "@tanstack/react-query";
 
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
 
type DataResponse = {
  data:  Record<string, any>[];
  total: number;
  page:  number;
  limit: number;
};
 
export const useData = (
  model: string,
  params?: { page?: number; limit?: number; search?: string; sortBy?: string; order?: string }
) =>
  useQuery<DataResponse>({
    queryKey: ["data", model, params],
    queryFn:  async () => {
      const query = new URLSearchParams();
      if (params?.page)    query.set("page",    String(params.page));
      if (params?.limit)   query.set("limit",   String(params.limit));
      if (params?.search)  query.set("search",  params.search);
      if (params?.sortBy)  query.set("sortBy",  params.sortBy);
      if (params?.order)   query.set("order",   params.order);
 
      const url = `${BASE}/${model}${query.toString() ? `?${query}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${model}`);
      return res.json();
    },
    enabled:  !!model,
    staleTime: 30_000,
    gcTime:    5 * 60_000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    refetchOnWindowFocus: true,
  });