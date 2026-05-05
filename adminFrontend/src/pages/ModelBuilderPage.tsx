import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAllModels, useDeleteModel } from "../hooks/useModelBuilder";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { ModelDef } from "../types/modelBuilder";
 
const ModelBuilderPage = () => {
  const navigate = useNavigate();
  const { data: models = [], isLoading } = useAllModels();
  const deleteMutation = useDeleteModel();
  const [deleteTarget, setDeleteTarget] = useState<ModelDef | null>(null);
  const [deleteData, setDeleteData]     = useState(false);
 
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
 
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-4xl mx-auto space-y-6">
 
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Model Builder</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Define your data models — they appear in the admin panel automatically.
            </p>
          </div>
          <button
            onClick={() => navigate("/builder/create")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
              bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Model
          </button>
        </div>
 
        {/* Model cards */}
        {models.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-sm mb-3">No models yet.</p>
            <button
              onClick={() => navigate("/builder/create")}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              Create your first model →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model.name}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5
                  hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{model.label}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{model.name}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    {(model.fields ?? []).length} fields
                  </span>
                </div>
 
                {/* Field preview pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(model.fields ?? []).slice(0, 5).map((f) => (
                    <span key={f.name}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600 font-mono">
                      {f.name}: <span className="text-indigo-500">{f.type}</span>
                    </span>
                  ))}
                  {(model.fields ?? []).length > 5 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-400">
                      +{model.fields.length - 5} more
                    </span>
                  )}
                </div>
 
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/${model.name}`)}
                    className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-gray-200
                      text-gray-600 hover:bg-gray-50 transition"
                  >
                    View Data
                  </button>
                  <button
                    onClick={() => navigate(`/builder/${model.name}/edit`)}
                    className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-indigo-200
                      text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                  >
                    Edit Schema
                  </button>
                  <button
                    onClick={() => setDeleteTarget(model)}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500
                      bg-red-50 hover:bg-red-100 transition text-xs font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Delete "{deleteTarget.label}" model?
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This will remove the schema definition. The data collection can optionally be deleted too.
            </p>
            <label className="flex items-center gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteData}
                onChange={(e) => setDeleteData(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-red-600 font-medium">
                Also delete all data in this collection
              </span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate({ name: deleteTarget.name, deleteData });
                  setDeleteTarget(null);
                  setDeleteData(false);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Delete Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ModelBuilderPage;