import { type FieldProps } from "../../../types/fields";
 
export const NumberField = ({ field, register, error }: FieldProps) => (
  <input
    type="number"
    placeholder={field.placeholder ?? "0"}
    {...register(field.name, { valueAsNumber: true })} 
    className={`w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border rounded-lg placeholder-gray-400
      focus:outline-none focus:ring-2 focus:bg-white transition
      ${error
        ? "border-red-400 focus:ring-red-300"
        : "border-gray-200 focus:ring-indigo-400 focus:border-transparent"
      }`}
  />
);