import FormRenderer from "../form/FormRenderer";
import type { Schema } from "../../types/schema";
 
type Props = {
  model: string;
  schema: Schema;
  editingItem: any | null;
  onSubmit: (data: any) => void;
  onCancelEdit: () => void;
  registerReset?: (fn: () => void) => void; // ← NEW
};
 
const ModelForm = ({ model, schema, editingItem, onSubmit, onCancelEdit, registerReset }: Props) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-gray-900 capitalize">
          {editingItem ? `Edit ${model}` : `Add New ${model}`}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {editingItem
            ? "Update the details below and save."
            : "Fill in the details to create a new record."}
        </p>
      </div>
      {editingItem && (
        <button
          onClick={onCancelEdit}
          className="text-sm text-gray-500 hover:text-red-500 font-medium flex items-center gap-1 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel Edit
        </button>
      )}
    </div>
    <div className="px-6 py-5">
      <FormRenderer
        schema={schema}
        onSubmit={onSubmit}
        initialData={editingItem}
        registerReset={registerReset}  // ← passed through
      />
    </div>
  </div>
);
 
export default ModelForm;