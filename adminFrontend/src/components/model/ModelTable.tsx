import { memo, useCallback, useRef, useEffect, useState } from "react";
import Table      from "../table/Table";
import type { Schema } from "../../types/schema";
 
type Props = {
  schema:       Schema;
  data:         Record<string, any>[];
  search:       string;
  onSearch:     (value: string) => void;
  onSort:       (field: string) => void;
  onEdit:       (row: any) => void;
  onDelete:     (id: string) => void;
  onView?:      (row: any) => void;
  page:         number;
  totalPages:   number;
  onPageChange: (page: number) => void;
};
 
// ── SearchInput ───────────────────────────────────────────────────
// Isolated component with its OWN local state.
// Syncs UP to parent via onSearch but doesn't re-render from parent.
// This is the fix for the focus loss bug:
//
// BUG: parent search state → re-render ModelTable → input remounts → focus lost
// FIX: input owns its own value, parent only receives updates via onChange
//      useEffect syncs parent → local only when model changes (reset case)
//
const SearchInput = memo(({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [localValue, setLocalValue] = useLocalState(value);
  const inputRef = useRef<HTMLInputElement>(null);
 
  // Only sync from parent when value resets to "" (model switch / clear)
  // NOT on every keystroke — that's what caused the focus loss
  useEffect(() => {
    if (value === "") setLocalValue("");
  }, [value]);
 
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
      onChange(e.target.value);     // notify parent
    },
    [onChange]
  );
 
  return (
    <div className="relative max-w-sm">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Search records..."
        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
          bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400
          focus:border-transparent placeholder-gray-400 transition"
      />
    </div>
  );
});
SearchInput.displayName = "SearchInput";
 
// Simple local state hook to avoid useState import noise in the component
function useLocalState(initial: string) {
  return useState(initial);  // just re-export for clarity
}
// (import useState at the top of the file)
 
// ── Pagination ────────────────────────────────────────────────────
const Pagination = memo(({
  page, totalPages, onPageChange,
}: { page: number; totalPages: number; onPageChange: (p: number) => void }) => {
  const handlePrev = useCallback(() => onPageChange(page - 1), [onPageChange, page]);
  const handleNext = useCallback(() => onPageChange(page + 1), [onPageChange, page]);
 
  return (
    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Page <span className="font-medium text-gray-700">{page}</span> of{" "}
        <span className="font-medium text-gray-700">{totalPages || 1}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={handlePrev}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200
            bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40
            disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>
        <button
          disabled={page >= totalPages}
          onClick={handleNext}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200
            bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40
            disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
});
Pagination.displayName = "Pagination";
 
// ── ModelTable ────────────────────────────────────────────────────
const ModelTable = memo(({
  schema, data, search, onSearch,
  onSort, onEdit, onDelete, onView,
  page, totalPages, onPageChange,
}: Props) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
 
    {/* Search — isolated component, maintains own focus */}
    <div className="px-5 py-4 border-b border-gray-100">
      <SearchInput value={search} onChange={onSearch} />
    </div>
 
    {/* Table */}
    <div className="overflow-x-auto">
      <Table
        schema={schema}
        data={data}
        onSort={onSort}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
      />
    </div>
 
    {/* Pagination */}
    <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
  </div>
));
 
ModelTable.displayName = "ModelTable";
export default ModelTable;