import { useNavigate } from "react-router-dom";
import { useSchema }   from "../../hooks/useSchema";
import { useUpdateMutation } from "../../hooks/mutations/useUpdateMutation";
import FormRenderer   from "../../components/form/FormRenderer";
import PageHeader     from "../../components/model/PageHeader";
import { useItem } from "../../hooks/useItem";
 
type Props = { model: string; id: string };  // ← string not number
 
const EditPage = ({ model, id }: Props) => {
  const navigate = useNavigate();
  const { data: schema, isLoading: schemaLoading, error: schemaError } = useSchema(model);
  const updateMutation = useUpdateMutation(model);
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
 
  const handleSubmit = (formData: any) => {
    updateMutation.mutate(
      { id, data: formData },
      { onSuccess: () => navigate(`/${model}`) }
    );
  };
 
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title={`Edit ${model.replace(/s$/, "")}`}
          subtitle={`Editing record ${id}`}
          onBack={() => navigate(`/${model}`)}
        />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <FormRenderer schema={schema} onSubmit={handleSubmit} initialData={item} />
        </div>
      </div>
    </div>
  );
};
 
export default EditPage;
 