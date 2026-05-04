import Table from "../table/Table";
import type { Schema } from "../../types/schema";
 
// ← Explicitly typed to match what useModelPage returns
type Props = {
  schema: Schema;
  data: Record<string, any>[];         // paginatedData from hook
  search: string;
  onSearch: (value: string) => void;   // handleSearch from hook
  onSort: (field: string) => void;     // handleSort from hook
  onEdit: (row: any) => void;          // handleEdit from hook
  onDelete: (id: number) => void;      // handleDelete from hook (or override)
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void; // setPage from hook
  onView:(row: any) => void;
};
 
const ModelTable = ({
  schema, data, search, onSearch,
  onSort, onEdit, onDelete, onView,
  page, totalPages, onPageChange,
}: Props) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
 
    <div className="px-5 py-4 border-b border-gray-100">
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search records..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400 transition"
        />
      </div>
    </div>
 
    <div className="overflow-x-auto">
      <Table schema={schema} data={data} onSort={onSort} onEdit={onEdit} onView={onView} onDelete={onDelete} />
    </div>
 
    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Page <span className="font-medium text-gray-700">{page}</span> of{" "}
        <span className="font-medium text-gray-700">{totalPages || 1}</span>
      </p>
      <div className="flex items-center gap-2">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
          ← Prev
        </button>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
          Next →
        </button>
      </div>
    </div>
  </div>
);
 
export default ModelTable;