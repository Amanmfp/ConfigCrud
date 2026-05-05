import { useNavigate } from "react-router-dom";
import { useModelPage } from "../../hooks/useModalPage";
import ModelTable from "../../components/model/ModelTable";
 
type Props = { model: string };
 
const ListPage = ({ model }: Props) => {
  const navigate = useNavigate();
  const hook = useModelPage(model);
 
  if (hook.isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
 
  if (hook.schemaError || hook.dataError)
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto bg-white border border-red-100 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900">Failed to load</h2>
          <p className="text-sm text-gray-500 mt-1">
            {(hook.schemaError as any)?.message ?? (hook.dataError as any)?.message ?? "Something went wrong."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold
              bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!hook.schema)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm">Schema not available.</p>
      </div>
    );
 
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
              {/* {hook.paginatedData.length} records shown */}
            </p>
          </div>
          <button
            onClick={() => navigate(`/${model}/create`)}
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
          search={hook.search}
          data={hook.data}
          onSearch={hook.handleSearch}
          onSort={hook.handleSort}
          onEdit={(row) => navigate(`/${model}/${row._id}/edit`)}
          onDelete={hook.handleDelete}
          onView={(row) => navigate(`/${model}/${row._id}`)}
          page={hook.page}
          totalPages={hook.totalPages}
          onPageChange={hook.setPage}
        />
      </div>
    </div>
  );
};
 
export default ListPage;
 