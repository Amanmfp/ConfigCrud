import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useData } from "../../hooks/useData";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { normalizeIds, normalizeId } from "../../utils/normalizeRelationValue";
import type { FieldProps } from "../../types/fields";
 
const RelationField = ({ field, control, error }: FieldProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<any[]>([]);

  const params = useMemo(
    () => ({ page, limit: 50, search: debouncedQuery || undefined }),
    [page, debouncedQuery]
  );

  const { data: response, isLoading, isFetching } = useData(field.relation!, params);
  const total = response?.total ?? 0;

  // When query changes, reset pagination + options
  useEffect(() => {
    setPage(1);
    setOptions([]);
  }, [debouncedQuery]);

  // Accumulate options across pages (for large datasets)
  useEffect(() => {
    if (!response?.data) return;
    setOptions((prev) => {
      const merged = [...prev, ...response.data];
      const seen = new Set<string>();
      return merged.filter((it: any) => {
        const key = String(it?._id ?? it?.id ?? "");
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
  }, [response]);

  const canLoadMore = options.length < total;
 
  if (isLoading)
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-400">Loading options...</span>
      </div>
    );
 
  const renderSearch = () => (
    <div className="space-y-2">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${field.relation}...`}
          className={`w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border rounded-lg
            focus:outline-none focus:ring-2 focus:bg-white transition
            ${error
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-200 focus:ring-indigo-400 focus:border-transparent"
            }`}
        />
        {isFetching && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {canLoadMore && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          Load more ({options.length}/{total})
        </button>
      )}
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
 
          const toggle = (id: string) => {
            const next = selectedIds.includes(id)
              ? selectedIds.filter((v) => v !== id)
              : [...selectedIds, id];
            rhfField.onChange(next);  
          };
 
          return (
            <div className="space-y-2.5">
              {renderSearch()}
              <div
                className={`flex flex-wrap gap-2 p-2.5 min-h-[2.75rem] bg-gray-50 border rounded-lg transition
                  ${error ? "border-red-400" : "border-gray-200"}`}
              >
                {options?.length === 0 ? (
                  <span className="text-xs text-gray-400 self-center px-1">
                    No options available
                  </span>
                ) : (
                  options?.map((item: any) => {
                    const id = String(item._id ?? item.id);
                    const selected = selectedIds.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggle(id)}
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
                        {item.name || item.label || item._id || item.id}
                      </button>
                    );
                  })
                )}
              </div>
              {selectedIds.length > 0 && (
                <p className="text-xs text-gray-400 pl-0.5">
                  {selectedIds.length} selected
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
          <div className="space-y-2.5">
            {renderSearch()}
            <div className="relative">
              <select
                value={selectedId ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  rhfField.onChange(val === "" ? undefined : val); 
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
                {options?.map((item: any) => (
                  <option key={item._id ?? item.id} value={item._id ?? item.id}>
                    {item.name || item.label || item._id || item.id}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};
 
export default RelationField;