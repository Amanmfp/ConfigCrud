export type Field = {
  name: string;
  type: string;
  required: boolean;
  relation?: string;
  multiple?: boolean;
  options?: string[];
 
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
 