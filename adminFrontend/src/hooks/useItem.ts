import { useQuery } from "@tanstack/react-query";

// const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const BASE = 'https://configcrud.onrender.com/api'

export const useItem = (model: string, id: string) =>
  useQuery<Record<string, any>>({
    queryKey: ["item", model, id],
    queryFn: async () => {
      const res = await fetch(`${BASE}/${model}/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to fetch record");
      return data;
    },
    enabled: !!model && !!id,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

