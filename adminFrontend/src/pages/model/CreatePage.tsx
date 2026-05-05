import { useNavigate } from "react-router-dom";
import { useSchema } from "../../hooks/useSchema";
import { useCreateMutation } from "../../hooks/mutations/useCreateMutation";
import FormRenderer from "../../components/form/FormRenderer";
import PageHeader from "../../components/model/PageHeader";
 
type Props = { model: string };
 
const CreatePage = ({ model }: Props) => {
  const navigate  = useNavigate();
  const { data: schema, isLoading, error } = useSchema(model);
  const createMutation = useCreateMutation(model);
 
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
 
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm">{(error as any)?.message ?? "Failed to load schema."}</p>
      </div>
    );

  if (!schema)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-sm">Schema not available.</p>
      </div>
    );
 
  const handleSubmit = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => navigate(`/${model}`), // ← back to list on success
    });
  };
 
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title={`Create ${model.replace(/s$/, "")}`}
          subtitle="Fill in the details below to add a new record."
          onBack={() => navigate(`/${model}`)}
        />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <FormRenderer
            schema={schema}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
 
export default CreatePage;