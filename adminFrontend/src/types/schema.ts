export type Field = {
  // ── Backend owns these ──
  name: string;
  type: string;
  required: boolean;
  relation?: string;
  multiple?: boolean;
  options?: string[];
 
  // ── Frontend owns these ──
  label?: string;
  placeholder?: string;
  helpText?: string;
  colSpan?: 1 | 2;
  order?: number;
  showInTable?: boolean;
  showInForm?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
};
 
export type Schema = {
  name: string;
  fields: Field[];
};
 
// Only the UI-owned properties — used to type frontend config files
// Pick extracts exactly these keys from Field, no more
export type UIFieldOverride = Pick<
  Field,
  | "label"
  | "placeholder"
  | "helpText"
  | "colSpan"
  | "order"
  | "showInTable"
  | "showInForm"
  | "readOnly"
  | "hidden"
>;
 
// Map of field name → UI overrides for a model
export type ModelUIConfig = Record<string, Partial<UIFieldOverride>>;