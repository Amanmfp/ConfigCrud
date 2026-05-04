import { type FieldProps } from "../../../types/fields";
import { Controller } from "react-hook-form";  
 
export const BooleanField = ({ field, control }: FieldProps) => (
  <Controller
    name={field.name}
    control={control}
    defaultValue={false}
    render={({ field: rhfField }) => (
      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {field.label ?? field.name}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={!!rhfField.value}
          onClick={() => rhfField.onChange(!rhfField.value)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
            ${rhfField.value ? "bg-indigo-600" : "bg-gray-300"}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
            ${rhfField.value ? "translate-x-4" : "translate-x-1"}`} />
        </button>
      </div>
    )}
  />
);
 