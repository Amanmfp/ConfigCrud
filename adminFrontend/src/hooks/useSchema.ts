import { useQuery } from "@tanstack/react-query";
import type { Schema } from "../types/schema";
 
// const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const BASE = 'https://configcrud.onrender.com/api'
 
export const useSchema = (model: string) =>
  useQuery<Schema>({
    queryKey: ["schema", model],
    queryFn:  async () => {
      const res = await fetch(`${BASE}/schema/${model}`);
      if (!res.ok) throw new Error(`Schema not found for "${model}"`);
      return res.json();
      // ← No mergeWithUIConfig — backend returns complete schema with UI metadata
    },
    enabled:  !!model,
    staleTime: Infinity,   // schema rarely changes — cache forever
    gcTime:    Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });