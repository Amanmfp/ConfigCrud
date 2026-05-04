import type { FieldProps } from "../../../types/fields";
 
export const DateField = ({ field, value, onChange }: FieldProps) => (
  <input
    type="date"
    value={value || ""}
    onChange={(e) => onChange(field.name, e.target.value)}
    className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white transition"
  />
);
 