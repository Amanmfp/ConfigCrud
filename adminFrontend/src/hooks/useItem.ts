import { useQuery } from "@tanstack/react-query";
import { fetchItem } from "../api"; 

export const useItem = (model: string, id: string) =>
  useQuery<Record<string, any>>({
    queryKey: ["item", model, id],
    queryFn: () => fetchItem(model, id),
    enabled: !!model && !!id,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });