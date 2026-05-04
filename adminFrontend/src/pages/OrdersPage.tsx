import { useState } from "react";
import { useModelPage } from "../hooks/useModalPage";
import ModelTable from "../components/model/ModelTable";
import ModelForm from "../components/model/ModelForm";
import ConfirmDialog from "../components/ui/ConfirmDialog";
 
const OrdersPage = () => {
  const hook = useModelPage("orders");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
 
  // Intercept delete — show dialog instead of deleting immediately
  const handleDeleteRequest = (id: number) => setPendingDeleteId(id);
 
  const handleConfirmDelete = () => {
    if (pendingDeleteId !== null) {
      hook.handleDelete(pendingDeleteId); // call real delete from hook
      setPendingDeleteId(null);
    }
  };
 
  const handleCancelDelete = () => setPendingDeleteId(null);
 
  if (hook.isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading orders...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage customer orders</p>
        </div>
 
        {/* onDelete is overridden — shows dialog instead of deleting directly */}
        <ModelTable
          schema={hook.schema}
          data={hook.paginatedData}
          search={hook.search}
          onSearch={hook.handleSearch}
          onSort={hook.handleSort}
          onEdit={hook.handleEdit}
          onDelete={handleDeleteRequest}   // ← overridden
          page={hook.page}
          totalPages={hook.totalPages}
          onPageChange={hook.setPage}
        />
 
        <ModelForm
          model="orders"
          schema={hook.schema}
          editingItem={hook.editingItem}
          onSubmit={hook.handleSubmit}
          onCancelEdit={hook.handleCancelEdit}
        />
 
        {/* Dialog only mounts when a delete is pending */}
        {pendingDeleteId !== null && (
          <ConfirmDialog
            title="Delete this order?"
            description="This action cannot be undone. The order and all its associated data will be permanently removed."
            confirmLabel="Yes, delete order"
            cancelLabel="Keep it"
            variant="danger"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </div>
  );
};
 
export default OrdersPage;