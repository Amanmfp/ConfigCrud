import { useQuery } from "@tanstack/react-query";
import { fetchSchema } from "../api"; 

export const useSchema = (model: string) =>
  useQuery<any>({
    queryKey: ["schema", model],
    queryFn: () => fetchSchema(model),
    enabled: !!model,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });