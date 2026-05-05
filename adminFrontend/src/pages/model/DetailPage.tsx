import { useNavigate } from "react-router-dom";
import { useSchema } from "../../hooks/useSchema";
import { getVisibleTableFields, getLabel } from "../../utils/fieldUtils";
import { useItem } from "../../hooks/useItem";
import PageHeader from "../../components/model/PageHeader";
 
type Props = { model: string; id: string };
 
const formatValue = (value: any, fieldType: string): string => {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value))
    return value.map((v) => (typeof v === "object" ? v.name ?? v.id : v)).join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (fieldType === "date") return new Date(value).toLocaleDateString();
  if (typeof value === "object" && "name" in value) return value.name;
  return value.toString();
};
 
const DetailPage = ({ model, id }: Props) => {
  const navigate = useNavigate();
  const { data: schema, isLoading: schemaLoading, error: schemaError } = useSchema(model);
  const { data: item, isLoading: itemLoading, error: itemError } = useItem(model, id);
 
  if (schemaLoading || itemLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
 
  if (schemaError || itemError)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm">
          {(schemaError as any)?.message ?? (itemError as any)?.message ?? "Failed to load record."}
        </p>
      </div>
    );

  if (!schema || !item)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm">Record not found.</p>
      </div>
    );
 
  const fields = getVisibleTableFields(schema.fields);
 
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
 
        {/* Header with Edit button */}
        <div className="flex items-start justify-between mb-8">
          <PageHeader
            title="Record Details"
            subtitle={`Viewing record ${id}`}
            onBack={() => navigate(`/${model}`)}
          />
          <button
            onClick={() => navigate(`/${model}/${id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
 
        {/* Field rows */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <dl className="divide-y divide-gray-100">
            {fields.map((field, idx) => (
              <div
                key={field.name}
                className={`flex items-start gap-6 px-6 py-4
                  ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
              >
                <dt className="w-40 shrink-0 text-xs font-semibold text-gray-400 uppercase tracking-wider pt-0.5">
                  {getLabel(field)}
                </dt>
                <dd className="flex-1 text-sm text-gray-800 font-medium">
                  {field.type === "boolean" ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${item[field.name] ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                      {item[field.name] ? "Yes" : "No"}
                    </span>
                  ) : (
                    formatValue(item[field.name], field.type)
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
 