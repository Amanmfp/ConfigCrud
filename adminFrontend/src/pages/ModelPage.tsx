import { useModelPage } from "../hooks/useModalPage";
import ModelTable from "../components/model/ModelTable";
import ModelForm from "../components/model/ModelForm";
 
const ModelPage = ({ model }: { model: string }) => {
  const hook = useModelPage(model);
 
  if (hook.isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
 
  if (!hook.schema)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-400 text-sm">No data available.</p>
      </div>
    );
 
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">{model}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and edit your {model.toLowerCase()} records</p>
        </div>
 
        <ModelTable
          schema={hook.schema}
          data={hook.paginatedData}
          search={hook.search}
          onSearch={hook.handleSearch}
          onSort={hook.handleSort}
          onEdit={hook.handleEdit}
          onDelete={hook.handleDelete}    // ← direct, no confirm
          page={hook.page}
          totalPages={hook.totalPages}
          onPageChange={hook.setPage}
        />
 
        <ModelForm
          model={model}
          schema={hook.schema}
          editingItem={hook.editingItem}
          onSubmit={hook.handleSubmit}
          onCancelEdit={hook.handleCancelEdit}
        />
      </div>
    </div>
  );
};
 
export default ModelPage;