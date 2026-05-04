import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";          // ← single import, that's it
import { deleteItem } from "../../api";
 
export const useDeleteMutation = (model: string) => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (id: number) => deleteItem(model, id),
 
    // Optimistic update — remove row instantly before API responds
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["data", model] });
 
      const previousData = queryClient.getQueryData<any[]>(["data", model]);
 
      queryClient.setQueryData<any[]>(["data", model], (old = []) =>
        old.filter((item) => item.id !== id)
      );
 
      return { previousData };
    },
 
    onSuccess: () => {
      toast.success("Record deleted", {
        description: "The record has been permanently removed.",
      });
    },
 
    onError: (error: any, _id, context) => {
      // Roll back optimistic removal
      if (context?.previousData) {
        queryClient.setQueryData(["data", model], context.previousData);
      }
      toast.error("Delete failed", {
        description: error?.message ?? "Something went wrong. Please try again.",
      });
    },
 
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["data", model] });
    },
  });
};