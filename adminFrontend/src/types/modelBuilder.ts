export type FieldType =
  | "string" | "number" | "boolean" | "date"
  | "enum" | "relation" | "array" | "mixed";
 
export type ValidatorType = "min" | "max" | "minLength" | "maxLength" | "match" | "custom";
 
export type FieldValidator = {
  type:    ValidatorType;
  value:   any;
  message: string;
};
 
export type FieldDef = {
  name:         string;
  type:         FieldType;
  required:     boolean;
  unique?:      boolean;
  default?:     any;
  options?:     string[];       // for enum
  relation?:    string;         // for relation
  multiple?:    boolean;        // for relation many-to-many
  arrayOf?:     "string" | "number" | "boolean";
  validators?:  FieldValidator[];
  // UI metadata
  label?:       string;
  placeholder?: string;
  helpText?:    string;
  colSpan?:     1 | 2;
  order?:       number;
  showInTable?: boolean;
  showInForm?:  boolean;
  readOnly?:    boolean;
  hidden?:      boolean;
};
 
export type ModelDef = {
  _id?:    string;
  name:    string;
  label:   string;
  icon?:   string;
  fields:  FieldDef[];
};