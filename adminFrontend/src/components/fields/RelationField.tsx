import { Controller } from "react-hook-form";
import { useData } from "../../hooks/useData";
import { normalizeIds, normalizeId } from "../../utils/normalizeRelationValue";
import type { FieldProps } from "../../types/fields";
 
const RelationField = ({ field, control, error }: FieldProps) => {
  const { data = [], isLoading } = useData(field.relation!);
 
  if (isLoading)
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-400">Loading options...</span>
      </div>
    );
 
  // ── MANY TO MANY ─────────────────────────────────────────────
  if (field.multiple) {
    return (
      <Controller
        name={field.name}
        control={control}
        defaultValue={[]}
        render={({ field: rhfField }) => {
          const selectedIds = normalizeIds(rhfField.value);
 
          const toggle = (id: number) => {
            const next = selectedIds.includes(id)
              ? selectedIds.filter((v) => v !== id)
              : [...selectedIds, id];
            rhfField.onChange(next);   // ← RHF onChange, not prop
          };
 
          return (
            <div className="space-y-1.5">
              <div
                className={`flex flex-wrap gap-2 p-2.5 min-h-[2.75rem] bg-gray-50 border rounded-lg transition
                  ${error ? "border-red-400" : "border-gray-200"}`}
              >
                {data.length === 0 ? (
                  <span className="text-xs text-gray-400 self-center px-1">
                    No options available
                  </span>
                ) : (
                  data.map((item: any) => {
                    const selected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggle(item.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-all
                          ${selected
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                          }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {item.name || item.id}
                      </button>
                    );
                  })
                )}
              </div>
              {selectedIds.length > 0 && (
                <p className="text-xs text-gray-400 pl-0.5">
                  {selectedIds.length} of {data.length} selected
                </p>
              )}
            </div>
          );
        }}
      />
    );
  }
 
  // ── MANY TO ONE ──────────────────────────────────────────────
  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue=""
      render={({ field: rhfField }) => {
        const selectedId = normalizeId(rhfField.value);
 
        return (
          <div className="relative">
            <select
              value={selectedId ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                rhfField.onChange(val === "" ? undefined : Number(val)); // ← RHF onChange
              }}
              onBlur={rhfField.onBlur}
              className={`w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border rounded-lg
                focus:outline-none focus:ring-2 focus:bg-white transition appearance-none
                ${error
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 focus:ring-indigo-400 focus:border-transparent"
                }`}
            >
              <option value="">Select {field.label ?? field.name}...</option>
              {data.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name || item.id}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );
      }}
    />
  );
};
 
export default RelationField;