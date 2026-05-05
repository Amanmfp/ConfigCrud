import { type Schema, type Field } from "../../types/schema";
import { getVisibleTableFields, getLabel } from "../../utils/fieldUtils";

type Props = {
  schema: Schema;
  data: Record<string, any>[];
  onSort: (field: string) => void;
  onEdit: (row: any) => void;
  onView?: (row: any) => void;
  onDelete: (id: string) => void;
};

const formatDate = (value: any): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value.toString();
  return date.toLocaleDateString("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
};

const formatCell = (value: any, field: Field) => {
  if (value === null || value === undefined) return "—";

  const isDateField =
    field.type === "date" ||
    /At$|Date$|_at$|_date$/i.test(field.name);

  if (isDateField) {
    return (
      <span className="text-gray-500 tabular-nums">
        {formatDate(value)}
      </span>
    );
  }

  if (Array.isArray(value)) {
    const labels = value
      .map((v) => (typeof v === "object" ? v.name ?? v.id : v))
      .join(", ");
    return (
      <span className="text-gray-600 truncate" title={labels}>
        {labels || "—"}
      </span>
    );
  }

  if (typeof value === "boolean") {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (typeof value === "object" && "name" in value) {
    return <span>{value.name}</span>;
  }

  return value.toString();
};

const Table = ({ schema, data, onSort, onEdit, onDelete, onView }: Props) => {
  const tableFields = getVisibleTableFields(schema.fields);

  return (
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {tableFields.map((field) => (
            <th
              key={field.name}
              onClick={() => onSort(field.name)}
              className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider
                cursor-pointer select-none hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <span className="flex items-center gap-1">
                {getLabel(field)}
                <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </span>
            </th>
          ))}
          <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={tableFields.length + 1}
              className="px-5 py-10 text-center text-sm text-gray-400"
            >
              No records found.
            </td>
          </tr>
        ) : (
          data.map((row) => (
            <tr
              key={row._id ?? row.id ?? JSON.stringify(row)}
              className="hover:bg-gray-50 transition-colors group"
            >
              {tableFields.map((field) => (
                <td
                  key={field.name}
                  className="px-5 py-3.5 text-gray-700 max-w-xs truncate"
                >
                  {formatCell(row[field.name], field)}
                </td>
              ))}

              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  {onView && (
                  <button
                    onClick={() => onView(row)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                      rounded-lg border border-gray-200 text-gray-600 bg-gray-50
                      hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  )}
                  <button
                    onClick={() => onEdit(row)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                      rounded-lg border border-indigo-200 text-indigo-600 bg-indigo-50
                      hover:bg-indigo-100 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(String(row._id))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                      rounded-lg border border-red-200 text-red-500 bg-red-50
                      hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;