import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateItem } from "../../api";
 
export const useUpdateMutation = (model: string) => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateItem(model, id, data),
 
    // Optimistic update — patch the row instantly
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["data", model] });
 
      const previousData = queryClient.getQueryData<any[]>(["data", model]);
 
      queryClient.setQueryData<any[]>(["data", model], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
 
      return { previousData };
    },
 
    onSuccess: () => {
      toast.success("Record updated", {
        description: "Your changes have been saved.",
      });
    },
 
    onError: (error: any, _vars, context) => {
      // Roll back optimistic patch
      if (context?.previousData) {
        queryClient.setQueryData(["data", model], context.previousData);
      }
      toast.error("Update failed", {
        description: error?.message ?? "Could not save changes. Please try again.",
      });
    },
 
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["data", model] });
    },
  });
};