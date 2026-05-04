// hooks/useSchema.ts

import { useQuery } from "@tanstack/react-query";
import { getSchema } from "../api";
import { mergeWithUIConfig } from "../configs/modelRegistry"; // ← updated import
import type { Schema } from "../types/schema";

export const useSchema = (model: string) =>
  useQuery<Schema>({
    queryKey: ["schema", model],
    queryFn: async () => {
      const apiSchema = await getSchema(model);
      return {
        ...apiSchema,
        fields: mergeWithUIConfig(model, apiSchema.fields), // ← updated function
      };
    },

    // Schema never changes at runtime — fetch once, cache forever
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });