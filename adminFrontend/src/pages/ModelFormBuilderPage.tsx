import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateModel, useUpdateModel, useModelDef } from "../hooks/useModelBuilder";
import type { ModelDef, FieldDef, FieldType } from "../types/modelBuilder";
import FieldBuilderRow from "../components/builder/FieldBuilderRow";
 
const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "string",   label: "String"   },
  { value: "number",   label: "Number"   },
  { value: "boolean",  label: "Boolean"  },
  { value: "date",     label: "Date"     },
  { value: "enum",     label: "Enum"     },
  { value: "relation", label: "Relation" },
  { value: "array",    label: "Array"    },
  { value: "mixed",    label: "Mixed"    },
];
 
const defaultField = (): FieldDef => ({
  name:        "",
  type:        "string",
  required:    false,
  showInTable: true,
  showInForm:  true,
  hidden:      false,
  readOnly:    false,
  order:       0,
});
 
type Props = { mode: "create" | "edit" };
 
const ModelFormBuilderPage = ({ mode }: Props) => {
  const navigate      = useNavigate();
  const { modelName } = useParams<{ modelName: string }>();
  const createMutation = useCreateModel();
  const updateMutation = useUpdateModel();
 
  const { data: existingModel } = useModelDef(mode === "edit" ? modelName! : "");
 
  const [name,   setName]   = useState("");
  const [label,  setLabel]  = useState("");
  const [icon,   setIcon]   = useState("package");
  const [fields, setFields] = useState<FieldDef[]>([defaultField()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && existingModel) {
      setName(existingModel.name);
      setLabel(existingModel.label);
      setIcon(existingModel.icon ?? "package");
      setFields(existingModel.fields.length ? existingModel.fields : [defaultField()]);
    }
  }, [existingModel, mode]);
 
  const addField    = () => setFields((prev) => [...prev, { ...defaultField(), order: prev.length }]);
  const removeField = (idx: number) => setFields((prev) => prev.filter((_, i) => i !== idx));
  const updateField = (idx: number, updated: FieldDef) =>
    setFields((prev) => prev.map((f, i) => (i === idx ? updated : f)));
 
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Model name is required";
    if (!/^[a-z][a-z0-9_]*$/.test(name)) errs.name = "Lowercase letters, numbers, underscores only";
    if (!label.trim()) errs.label = "Display label is required";
    fields.forEach((f, i) => {
      if (!f.name.trim()) errs[`field_${i}_name`] = "Field name required";
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(f.name)) errs[`field_${i}_name`] = "Invalid field name";
    });
    // check duplicate field names
    const names = fields.map((f) => f.name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    dupes.forEach((d) => {
      const idx = fields.findLastIndex((f) => f.name === d);
      errs[`field_${idx}_name`] = "Duplicate field name";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
 
  const handleSubmit = () => {
    if (!validate()) return;
    const payload: ModelDef = { name, label, icon, fields };
 
    if (mode === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => navigate("/builder"),
      });
    } else {
      updateMutation.mutate(
        { name: modelName!, data: { label, icon, fields } },
        { onSuccess: () => navigate("/builder") }
      );
    }
  };
 
  const isLoading = createMutation.isPending || updateMutation.isPending;
 
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto space-y-8">
 
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/builder")}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200
              bg-white text-gray-500 hover:text-gray-800 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {mode === "create" ? "Create New Model" : `Edit "${existingModel?.label ?? modelName}"`}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Define the fields for this model. Changes take effect immediately.
            </p>
          </div>
        </div>
 
        {/* Model metadata */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Model Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Model Name <span className="text-red-400">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                disabled={mode === "edit"}
                placeholder="e.g. products"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-gray-50 font-mono
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition
                  ${errors.name ? "border-red-400" : "border-gray-200"}
                  ${mode === "edit" ? "opacity-60 cursor-not-allowed" : ""}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              <p className="mt-1 text-xs text-gray-400">Used in API URLs — cannot change after creation</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Display Label <span className="text-red-400">*</span>
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Products"
                className={`w-full px-3 py-2 text-sm rounded-lg border bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition
                  ${errors.label ? "border-red-400" : "border-gray-200"}`}
              />
              {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label}</p>}
            </div>
          </div>
        </div>
 
        {/* Field builder */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              Fields <span className="ml-2 text-xs text-gray-400 font-normal">{fields.length} defined</span>
            </h2>
            <button onClick={addField}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                rounded-lg border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Field
            </button>
          </div>
 
          <div className="divide-y divide-gray-100">
            {fields.map((field, idx) => (
              <FieldBuilderRow
                key={idx}
                field={field}
                index={idx}
                fieldTypes={FIELD_TYPES}
                errors={errors}
                onChange={(updated) => updateField(idx, updated)}
                onRemove={() => removeField(idx)}
              />
            ))}
          </div>
        </div>
 
        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button onClick={() => navigate("/builder")}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
              bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed
              active:scale-95 transition-all shadow-sm"
          >
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
            ) : (
              <>{mode === "create" ? "Create Model" : "Save Changes"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default ModelFormBuilderPage