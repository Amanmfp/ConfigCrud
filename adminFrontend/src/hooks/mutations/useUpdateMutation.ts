import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateItem } from "../../api";
 
export const useUpdateMutation = (model: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateItem(model, id, data),
 
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["data", model] });
      const previousData = queryClient.getQueryData(["data", model]);
      queryClient.setQueryData(["data", model], (old: any) =>
        old ? {
          ...old,
          data: old.data.map((item: any) =>
            item._id === id ? { ...item, ...data } : item
          )
        } : old
      );
      return { previousData };
    },
 
    onSuccess: () => toast.success("Record updated"),
 
    onError: (error: any, _vars, context) => {
      if (context?.previousData)
        queryClient.setQueryData(["data", model], context.previousData);
      toast.error("Update failed", { description: error?.message });
    },
 
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["data", model] }),
  });
};
 