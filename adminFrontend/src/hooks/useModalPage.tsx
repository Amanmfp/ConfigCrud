
import { useRef, useCallback, useState, useMemo } from "react";
import { useSchema } from "./useSchema";
import { useData }   from "./useData";
import { useDeleteMutation } from "./mutations/useDeleteMutation";
import { useCreateMutation } from "./mutations/useCreateMutation";
 
const PAGE_SIZE = 10;
 
export const useModelPage = (model: string) => {
  const [search,    setSearch]    = useState("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page,      setPage]      = useState(1);
 
  const { data: schema,   isLoading: schemaLoading, error: schemaError } = useSchema(model);
  const { data: response, isLoading: dataLoading,   error: dataError   } = useData(model, {
    page,
    limit:  PAGE_SIZE,
    search,
    sortBy: sortField,
    order:  sortOrder,
  });
 
  const deleteMutation = useDeleteMutation(model);
  const createMutation = useCreateMutation(model);
 
  const resetFormRef  = useRef<(() => void) | null>(null);
 
  // ── Stable callbacks — no recreation on every render ─────────
  const registerReset = useCallback((fn: () => void) => {
    resetFormRef.current = fn;
  }, []);
 
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);
 
  const handleSort = useCallback((field: string) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortOrder("asc");
      return field;
    });
  }, []);
 
  const handleDelete = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );
 
  const handleSubmit = useCallback(
    (formData: any) => {
      createMutation.mutate(formData, {
        onSuccess: () => resetFormRef.current?.(),
      });
    },
    [createMutation]
  );
 
  // ── Derived values — memoised ─────────────────────────────────
  const totalPages = useMemo(
    () => Math.ceil((response?.total ?? 0) / PAGE_SIZE),
    [response?.total]
  );
 
  return {
    isLoading:    schemaLoading || dataLoading,
    schemaError,
    dataError,
    schema,
    data:         response?.data ?? [],
    total:        response?.total ?? 0,
    totalPages,
    handleSort,
    handleDelete,
    handleSubmit,
    search,
    handleSearch,
    page,
    setPage,
    registerReset,
    isDeleting:   deleteMutation.isPending,
    isSubmitting: createMutation.isPending,
  };
};
 
export type ModelPageHook = ReturnType<typeof useModelPage>;