import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createItem } from "../../api";
 
export const useCreateMutation = (model: string) => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (data: any) => createItem(model, data),
 
    onSuccess: () => {
      toast.success("Record created", {
        description: `New ${model.toLowerCase()} has been added successfully.`,
      });
    },
 
    onError: (error: any) => {
      toast.error("Create failed", {
        description: error?.message ?? "Could not create the record. Please try again.",
      });
    },
 
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["data", model] });
    },
  });
};
 