import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../api"; 

type DataResponse = {
  data: Record<string, any>[];
  total: number;
  page: number;
  limit: number;
};

export const useData = (
  model: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: string;
  }
) =>
  useQuery<DataResponse>({
    queryKey: ["data", model, params],
    queryFn: () => fetchData(model, params),
    enabled: !!model,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    refetchOnWindowFocus: true,
  });