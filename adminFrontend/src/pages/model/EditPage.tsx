import { useNavigate } from "react-router-dom";
import { useSchema } from "../../hooks/useSchema";
import { useData } from "../../hooks/useData";
import { useUpdateMutation } from "../../hooks/mutations/useUpdateMutation";
import FormRenderer from "../../components/form/FormRenderer";
import PageHeader from "../../components/model/PageHeader";
 
type Props = { model: string; id: number };
 
const EditPage = ({ model, id }: Props) => {
  const navigate = useNavigate();
  const { data: schema, isLoading: schemaLoading } = useSchema(model);
  const { data: records = [], isLoading: dataLoading } = useData(model);
  const updateMutation = useUpdateMutation(model);
 
  const item = records.find((r: any) => r.id === id);
 
  if (schemaLoading || dataLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
          subtitle={`Editing record #${id}`}
          onBack={() => navigate(`/${model}`)}
        />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <FormRenderer
            schema={schema}
            onSubmit={handleSubmit}
            initialData={item}
          />
        </div>
      </div>
    </div>
  );
};
 
export default EditPage;