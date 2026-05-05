// import { useRef, useState, useCallback } from "react";
// import { useSchema } from "./useSchema";
// import { useData } from "./useData";
// import { useDeleteMutation } from "./mutations/useDeleteMutation";
// import { useCreateMutation } from "./mutations/useCreateMutation";
// import { useUpdateMutation } from "./mutations/useUpdateMutation";
 
// const PAGE_SIZE = 5;
 
// export const useModelPage = (model: string) => {
//   const { data: schema, isLoading: schemaLoading } = useSchema(model);
//   const { data: rawData = [], isLoading: dataLoading } = useData(model);
 
//   const deleteMutation = useDeleteMutation(model);
//   const createMutation = useCreateMutation(model);
//   const updateMutation = useUpdateMutation(model);
 
//   const [editingItem, setEditingItem] = useState<any | null>(null);
//   const [search, setSearch]           = useState("");
//   const [sortField, setSortField]     = useState<string | null>(null);
//   const [sortOrder, setSortOrder]     = useState<"asc" | "desc">("asc");
//   const [page, setPage]               = useState(1);
 
//   const resetFormRef = useRef<(() => void) | null>(null);
 
//   // ← useCallback: stable reference across renders
//   // FormRenderer's useEffect only fires once on mount
//   const registerReset = useCallback((fn: () => void) => {
//     resetFormRef.current = fn;
//   }, []); // empty deps — never recreated
 
//   const filteredData = rawData.filter((item) =>
//     Object.values(item).some((val) =>
//       val?.toString().toLowerCase().includes(search.toLowerCase())
//     )
//   );
 
//   const sortedData = [...filteredData].sort((a, b) => {
//     if (!sortField) return 0;
//     const aVal = a[sortField];
//     const bVal = b[sortField];
//     if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
//     if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
//     return 0;
//   });
 
//   const totalPages    = Math.ceil(sortedData.length / PAGE_SIZE);
//   const paginatedData = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
 
//   const handleSearch = (value: string) => { setSearch(value); setPage(1); };
 
//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };
 
//   const handleEdit       = (item: any) => setEditingItem(item);
 
//   const handleCancelEdit = () => {
//     setEditingItem(null);
//     resetFormRef.current?.();
//   };
 
//   const handleDelete = (id: number) => deleteMutation.mutate(id);
 
//   const handleSubmit = (formData: any) => {
//     if (editingItem) {
//       updateMutation.mutate(
//         { id: editingItem.id, data: formData },
//         {
//           onSuccess: () => {
//             setEditingItem(null);
//             resetFormRef.current?.();
//           },
//         }
//       );
//     } else {
//       createMutation.mutate(formData, {
//         onSuccess: () => {
//           resetFormRef.current?.();
//         },
//       });
//     }
//   };
 
//   return {
//     isLoading:    schemaLoading || dataLoading,
//     schema,
//     paginatedData,
//     handleSort,
//     handleDelete,
//     handleEdit,
//     search,
//     handleSearch,
//     page,
//     totalPages,
//     setPage,
//     editingItem,
//     handleSubmit,
//     handleCancelEdit,
//     isDeleting:   deleteMutation.isPending,
//     isSubmitting: createMutation.isPending || updateMutation.isPending,
//     registerReset,  // ← stable reference now
//   };
// };
 
// export type ModelPageHook = ReturnType<typeof useModelPage>;


import { useRef, useCallback, useState } from "react";
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
 
  const {
    data: schema,
    isLoading: schemaLoading,
    error: schemaError,
  } = useSchema(model);
 
  // Pass search/sort/page to backend — server-side now
  const {
    data: response,
    isLoading: dataLoading,
    error: dataError,
  } = useData(model, {
    page,
    limit:  PAGE_SIZE,
    search,
    sortBy: sortField,
    order:  sortOrder,
  });
 
  const deleteMutation = useDeleteMutation(model);
  const createMutation = useCreateMutation(model);
 
  const resetFormRef  = useRef<(() => void) | null>(null);
  const registerReset = useCallback((fn: () => void) => {
    resetFormRef.current = fn;
  }, []);
 
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
 
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
 
  const handleDelete = (id: string) => deleteMutation.mutate(id);
 
  const handleSubmit = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => resetFormRef.current?.(),
    });
  };
 
  return {
    isLoading:    schemaLoading || dataLoading,
    schemaError,
    dataError,
    schema,
    // data now comes from backend paginated response
    data:         response?.data ?? [],
    total:        response?.total ?? 0,
    totalPages:   Math.ceil((response?.total ?? 0) / PAGE_SIZE),
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
 