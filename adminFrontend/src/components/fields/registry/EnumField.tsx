import { type FieldProps } from "../../../types/fields";
 
export const EnumField = ({ field, register, error }: FieldProps) => (
  <div className="relative">
    <select
      {...register(field.name)}
      className={`w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border rounded-lg
        focus:outline-none focus:ring-2 focus:bg-white transition appearance-none
        ${error
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-200 focus:ring-indigo-400 focus:border-transparent"
        }`}
    >
      <option value="">Select {field.label ?? field.name}...</option>
      {(field.options ?? []).map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);
 