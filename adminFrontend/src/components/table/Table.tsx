import { type Schema } from "../../types/schema";
import { getVisibleTableFields, getLabel } from "../../utils/fieldUtils";

type Props = {
  schema: Schema;
  data: Record<string, any>[];
  onSort: (field: string) => void;
  onEdit: (row: any) => void;
  onDelete: (id: number) => void;
};

const Table = ({ schema, data, onSort, onEdit, onDelete }: Props) => {
  const tableFields = getVisibleTableFields(schema.fields);

  const formatCell = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (Array.isArray(value)) return value.join(", ");

    if (typeof value === "boolean") {
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-500"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }

    return value.toString();
  };

  return (
    <table className="w-full text-sm text-left">
      {/* HEADER */}
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {tableFields.map((field) => (
            <th
              key={field.name}
              onClick={() => onSort(field.name)}
              className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <span className="flex items-center gap-1">
                {getLabel(field)}
                <svg
                  className="w-3 h-3 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </span>
            </th>
          ))}

          <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">
            Actions
          </th>
        </tr>
      </thead>

      {/* BODY */}
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
              key={row.id ?? JSON.stringify(row)} // fallback if id missing
              className="hover:bg-gray-50 transition-colors group"
            >
              {tableFields.map((field) => (
                <td
                  key={field.name}
                  className="px-5 py-3.5 text-gray-700 max-w-xs truncate"
                >
                  {formatCell(row[field.name])}
                </td>
              ))}

              {/* ACTIONS */}
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(row)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(row.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                  >
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