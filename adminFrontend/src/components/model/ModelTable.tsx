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
 
const SearchInput = memo(({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [localValue, setLocalValue] = useLocalState(value);
  const inputRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    if (value === "") setLocalValue("");
  }, [value]);
 
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
      onChange(e.target.value);    
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
 
function useLocalState(initial: string) {
  return useState(initial);  
}
 
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
 

const ModelTable = memo(({
  schema, data, search, onSearch,
  onSort, onEdit, onDelete, onView,
  page, totalPages, onPageChange,
}: Props) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
 
    {/* Search  */}
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
 
export default ModelTable;