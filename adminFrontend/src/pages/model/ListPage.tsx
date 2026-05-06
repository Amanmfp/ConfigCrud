import { memo, useCallback }  from "react";
import { useNavigate }        from "react-router-dom";
import { useQueryClient }     from "@tanstack/react-query";
import { useModelPage }       from "../../hooks/useModalPage";
import ModelTable             from "../../components/model/ModelTable";
 
type Props = { model: string };
 
// ── Loading state ─────────────────────────────────────────────────
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 font-medium">Loading...</p>
    </div>
  </div>
);
 
// ── Error state ───────────────────────────────────────────────────
// Uses React Query's refetch instead of full page reload
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="px-4 py-10 sm:px-6 lg:px-10">
    <div className="max-w-3xl mx-auto bg-white border border-red-100 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-gray-900">Failed to load</h2>
      <p className="text-sm text-gray-500 mt-1">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold
          bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        Retry
      </button>
    </div>
  </div>
);
 
// ── Empty schema state ────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <p className="text-gray-400 text-sm">Schema not available.</p>
  </div>
);
 
// ── ListPage ──────────────────────────────────────────────────────
const ListPage = memo(({ model }: Props) => {
  const navigate     = useNavigate();
  const queryClient  = useQueryClient();
  const hook         = useModelPage(model);
 
  // Stable handlers — no inline arrows in JSX
  const handleCreate = useCallback(
    () => navigate(`/${model}/create`),
    [navigate, model]
  );
 
  const handleEdit = useCallback(
    (row: any) => navigate(`/${model}/${row._id}/edit`),
    [navigate, model]
  );
 
  const handleView = useCallback(
    (row: any) => navigate(`/${model}/${row._id}`),
    [navigate, model]
  );
 
  // React Query retry — invalidates cache and refetches
  // Better than window.location.reload() which loses all state
  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["schema", model] });
    queryClient.invalidateQueries({ queryKey: ["data",   model] });
  }, [queryClient, model]);
 
  if (hook.isLoading) return <LoadingState />;
 
  if (hook.schemaError || hook.dataError) {
    const message =
      (hook.schemaError as any)?.message ??
      (hook.dataError  as any)?.message  ??
      "Something went wrong.";
    return <ErrorState message={message} onRetry={handleRetry} />;
  }
 
  if (!hook.schema) return <EmptyState />;
 
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-6">
 
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">
              {model}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {hook.total > 0 ? `${hook.total} total records` : "No records yet"}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
              bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {model.replace(/s$/, "")}
          </button>
        </div>
 
        <ModelTable
          schema={hook.schema}
          data={hook.data}
          search={hook.search}
          onSearch={hook.handleSearch}
          onSort={hook.handleSort}
          onEdit={handleEdit}
          onDelete={hook.handleDelete}
          onView={handleView}
          page={hook.page}
          totalPages={hook.totalPages}
          onPageChange={hook.setPage}
        />
      </div>
    </div>
  );
});
 
ListPage.displayName = "ListPage";
export default ListPage;