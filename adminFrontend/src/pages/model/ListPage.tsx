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
 
  if (!hook.schema) return null;
 
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
              {hook.paginatedData.length} records shown
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
          data={hook.paginatedData}
          search={hook.search}
          onSearch={hook.handleSearch}
          onSort={hook.handleSort}
          onEdit={(row) => navigate(`/${model}/${row.id}/edit`)}
          onDelete={hook.handleDelete}
          onView={(row) => navigate(`/${model}/${row.id}`)}
          page={hook.page}
          totalPages={hook.totalPages}
          onPageChange={hook.setPage}
        />
      </div>
    </div>
  );
};
 
export default ListPage;
 