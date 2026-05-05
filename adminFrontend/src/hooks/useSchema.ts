// // hooks/useSchema.ts

// import { useQuery } from "@tanstack/react-query";
// import { getSchema } from "../api";
// import { mergeWithUIConfig } from "../configs/modelRegistry"; // ← updated import
// import type { Schema } from "../types/schema";

// export const useSchema = (model: string) =>
//   useQuery<Schema>({
//     queryKey: ["schema", model],
//     queryFn: async () => {
//       const apiSchema = await getSchema(model);
//       return {
//         ...apiSchema,
//         fields: mergeWithUIConfig(model, apiSchema.fields), // ← updated function
//       };
//     },

//     // Schema never changes at runtime — fetch once, cache forever
//     staleTime: Infinity,
//     gcTime: Infinity,
//     retry: 1,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
//   });

import { useQuery } from "@tanstack/react-query";
import type { Schema } from "../types/schema";
 
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
 
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