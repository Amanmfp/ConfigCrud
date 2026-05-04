import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodSchema } from "../../utils/buildZodSchema";
import { getVisibleFormFields } from "../../utils/fieldUtils";
import FieldRenderer from "../fields/FieldRenderer";
import type { Schema } from "../../types/schema";
 
type Props = {
  schema: Schema;
  onSubmit: (data: any) => void;
  initialData?: any;
};
 
const FormRenderer = ({ schema, onSubmit, initialData }: Props) => {
  const visibleFields = getVisibleFormFields(schema.fields);
 
  // Build Zod schema from fields at runtime — no per-model config needed
  const zodSchema = buildZodSchema(visibleFields);
 
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: initialData ?? {},
  });
 
  // When switching between edit items, reset form with new data
  useEffect(() => {
    reset(initialData ?? {});
  }, [initialData, reset]);
 
  const isEditing = !!initialData;

  console.log("schema here", schema)
 
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {visibleFields.map((field) => (
          <div
            key={field.name}
            className={field.colSpan === 2 ? "md:col-span-2" : ""}
          >
            <FieldRenderer
              field={field}
              register={register}
              control={control}
              error={errors[field.name] as any}
            />
          </div>
        ))}
      </div>
 
      {/* Global form error count banner — shows when submit fails validation */}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600">
            Please fix{" "}
            <span className="font-semibold">{Object.keys(errors).length}</span>{" "}
            {Object.keys(errors).length === 1 ? "error" : "errors"} before submitting.
          </p>
        </div>
      )}
 
      {/* Submit */}
      <div className="pt-2 flex items-center justify-between">
        {/* Dirty state indicator */}
        {isDirty && (
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Unsaved changes
          </p>
        )}
        <div className="ml-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
              bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-sm
              disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Record
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
 
export default FormRenderer;
 
 