import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteItem } from "../../api";
 
export const useDeleteMutation = (model: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteItem(model, id),
 
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["data", model] });
      const previousData = queryClient.getQueryData(["data", model]);
      queryClient.setQueryData(["data", model], (old: any) =>
        old ? { ...old, data: old.data.filter((item: any) => item._id !== id) } : old
      );
      return { previousData };
    },
 
    onSuccess: () => toast.success("Record deleted"),
 
    onError: (error: any, _id, context) => {
      if (context?.previousData)
        queryClient.setQueryData(["data", model], context.previousData);
      toast.error("Delete failed", { description: error?.message });
    },
 
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["data", model] }),
  });
};
 