import { getFieldComponent } from "./fieldRegistry";
import { getLabel } from "../../utils/fieldUtils";
import type { FieldProps } from "../../types/fields";
 
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
 
const FieldRenderer = ({ field, register, control, error }: FieldProps) => {
  if (field.readOnly) {
    return (
      <div>
        <label className={labelClass}>{getLabel(field)}</label>
        <p className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-200 rounded-lg min-h-[2.375rem]">
          —
        </p>
      </div>
    );
  }
 
  const Component = getFieldComponent(field.type);
  if (!Component) {
    return (
      <div>
        <label className={labelClass}>{getLabel(field)}</label>
        <div className="px-3 py-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg">
          Unsupported field type: <span className="font-semibold">{field.type}</span>
        </div>
      </div>
    );
  }
 
  return (
    <div>
      {field.type !== "boolean" && (
        <label className={labelClass}>{getLabel(field)}</label>
      )}
 
      {/* Field input */}
      <Component
        field={field}
        register={register}
        control={control}
        error={error}
      />
 
      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error.message}
        </p>
      )}
 
      {/* Help text — only when no error */}
      {!error && field.helpText && (
        <p className="mt-1.5 text-xs text-gray-400">{field.helpText}</p>
      )}
    </div>
  );
};
 
export default FieldRenderer;