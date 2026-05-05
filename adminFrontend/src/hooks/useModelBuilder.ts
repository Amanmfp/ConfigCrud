import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as metaApi from "../api/meta";
import type { ModelDef } from "../types/modelBuilder";
 
export const useAllModels = () =>
  useQuery({
    queryKey: ["meta", "models"],
    queryFn:  metaApi.fetchAllModels,
    staleTime: 30_000,
  });
 
export const useModelDef = (name: string) =>
  useQuery({
    queryKey: ["meta", "models", name],
    queryFn:  () => metaApi.fetchModelDef(name),
    enabled:  !!name,
  });
 
export const useCreateModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: metaApi.createModelDef,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meta", "models"] });
      queryClient.invalidateQueries({ queryKey: ["models"] }); // sidebar
      toast.success("Model created", { description: `"${data.label}" is now available.` });
    },
    onError: (err: any) => toast.error("Create failed", { description: err.message }),
  });
};
 
export const useUpdateModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string; data: Partial<ModelDef> }) =>
      metaApi.updateModelDef(name, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["meta", "models"] });
      queryClient.invalidateQueries({ queryKey: ["schema", data.name] }); // refresh schema cache
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model updated", { description: "Schema changes are live." });
    },
    onError: (err: any) => toast.error("Update failed", { description: err.message }),
  });
};
 
export const useDeleteModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, deleteData }: { name: string; deleteData: boolean }) =>
      metaApi.deleteModelDef(name, deleteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta", "models"] });
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success("Model deleted");
    },
    onError: (err: any) => toast.error("Delete failed", { description: err.message }),
  });
};
 
 