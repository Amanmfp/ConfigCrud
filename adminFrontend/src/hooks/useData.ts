import { useQuery } from "@tanstack/react-query";
import { getList } from "../api";

export const useData = (model: string) => {
  return useQuery<Record<string, any>[]>({
    queryKey: ["data", model],
    queryFn: () => getList(model),
  });
};