import { useState } from "react";
import type { FieldDef, FieldType } from "../../types/modelBuilder";
 
type Props = {
  field:      FieldDef;
  index:      number;
  fieldTypes: { value: FieldType; label: string }[];
  errors:     Record<string, string>;
  onChange:   (field: FieldDef) => void;
  onRemove:   () => void;
};
 
const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";
 
const FieldBuilderRow = ({ field, index, fieldTypes, errors, onChange, onRemove }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const nameError = errors[`field_${index}_name`];
  const relationError = errors[`field_${index}_relation`];
  const optionsError = errors[`field_${index}_options`];
  const arrayOfError = errors[`field_${index}_arrayOf`];
 
  const update = (patch: Partial<FieldDef>) => onChange({ ...field, ...patch });
 
  return (
    <div className="px-6 py-4 space-y-4">
      {/* Basic row */}
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div className="mt-2.5 text-gray-300 cursor-grab">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm8 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM8 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm8 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM8 21a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm8 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
          </svg>
        </div>
 
        {/* Field name */}
        <div className="flex-1">
          <input
            value={field.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="fieldName"
            className={`${inputCls} font-mono ${nameError ? "border-red-400 focus:ring-red-300" : ""}`}
          />
          {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
        </div>
 
        {/* Type select */}
        <div className="w-36">
          <select
            value={field.type}
            onChange={(e) => update({ type: e.target.value as FieldType })}
            className={`${inputCls} appearance-none`}
          >
            {fieldTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
 
        {/* Required toggle */}
        <div className="flex items-center gap-1.5 mt-1.5 shrink-0">
          <button
            type="button"
            onClick={() => update({ required: !field.required })}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
              ${field.required ? "bg-indigo-600" : "bg-gray-300"}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
              ${field.required ? "translate-x-4" : "translate-x-1"}`} />
          </button>
          <span className="text-xs text-gray-500 w-16">{field.required ? "Required" : "Optional"}</span>
        </div>
 
        {/* Expand / Remove */}
        <button onClick={() => setExpanded((p) => !p)}
          className="mt-1 text-gray-400 hover:text-indigo-600 transition"
          title="Advanced options"
        >
          <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button onClick={onRemove} className="mt-1 text-gray-300 hover:text-red-500 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
 
      {/* Expanded advanced options */}
      {expanded && (
        <div className="ml-7 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
 
          {/* Enum options */}
          {field.type === "enum" && (
            <div className="md:col-span-2">
              <label className={labelCls}>Options (comma separated)</label>
              <input
                value={(field.options ?? []).join(", ")}
                onChange={(e) => update({ options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="pending, active, inactive"
                className={`${inputCls} ${optionsError ? "border-red-400 focus:ring-red-300" : ""}`}
              />
              {optionsError && <p className="mt-1 text-xs text-red-500">{optionsError}</p>}
            </div>
          )}
 
          {/* Relation config */}
          {field.type === "relation" && (
            <>
              <div>
                <label className={labelCls}>Related Model</label>
                <input
                  value={field.relation ?? ""}
                  onChange={(e) => update({ relation: e.target.value })}
                  placeholder="users"
                  className={`${inputCls} font-mono ${relationError ? "border-red-400 focus:ring-red-300" : ""}`}
                />
                {relationError && <p className="mt-1 text-xs text-red-500">{relationError}</p>}
              </div>
              <div className="flex items-center gap-2 mt-6">
                <button type="button" onClick={() => update({ multiple: !field.multiple })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                    ${field.multiple ? "bg-indigo-600" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
                    ${field.multiple ? "translate-x-4" : "translate-x-1"}`} />
                </button>
                <span className="text-xs text-gray-500">Many-to-many</span>
              </div>
            </>
          )}
 
          {/* Array config */}
          {field.type === "array" && (
            <div>
              <label className={labelCls}>Array Item Type</label>
              <select value={field.arrayOf ?? "string"} onChange={(e) => update({ arrayOf: e.target.value as any })}
                className={`${inputCls} appearance-none ${arrayOfError ? "border-red-400 focus:ring-red-300" : ""}`}>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              {arrayOfError && <p className="mt-1 text-xs text-red-500">{arrayOfError}</p>}
            </div>
          )}
 
          {/* UI metadata */}
          <div>
            <label className={labelCls}>Display Label</label>
            <input value={field.label ?? ""} onChange={(e) => update({ label: e.target.value })}
              placeholder="Auto-derived if empty" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Placeholder</label>
            <input value={field.placeholder ?? ""} onChange={(e) => update({ placeholder: e.target.value })}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Help Text</label>
            <input value={field.helpText ?? ""} onChange={(e) => update({ helpText: e.target.value })}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Column Span</label>
            <select value={field.colSpan ?? 1} onChange={(e) => update({ colSpan: Number(e.target.value) as 1 | 2 })}
              className={`${inputCls} appearance-none`}>
              <option value={1}>Half width</option>
              <option value={2}>Full width</option>
            </select>
          </div>
 
          {/* Visibility toggles */}
          <div className="md:col-span-2 flex flex-wrap gap-4">
            {[
              { key: "showInTable", label: "Show in table" },
              { key: "showInForm",  label: "Show in form"  },
              { key: "readOnly",    label: "Read only"     },
              { key: "hidden",      label: "Hidden"        },
              { key: "unique",      label: "Unique"        },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!(field as any)[key]}
                  onChange={(e) => update({ [key]: e.target.checked } as any)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-600">{label}</span>
              </label>
            ))}
          </div>
 
          {/* Default value */}
          {["string", "number", "boolean"].includes(field.type) && (
            <div>
              <label className={labelCls}>Default Value</label>
              <input
                value={field.default ?? ""}
                onChange={(e) => update({ default: e.target.value })}
                placeholder="Optional default"
                className={inputCls}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
export default FieldBuilderRow;