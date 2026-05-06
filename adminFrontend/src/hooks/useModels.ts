import { useQuery } from "@tanstack/react-query";
import { fetchModels } from "../api"; 

export type ModelMeta = {
  _id?: string;
  name: string;
  label: string;
  icon?: string;
};

export const useModels = () =>
  useQuery<any>({
    queryKey: ["models"],
    queryFn: fetchModels,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 2,
    refetchOnWindowFocus: false,
  });