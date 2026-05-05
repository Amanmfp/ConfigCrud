import mongoose, { Schema, Document } from "mongoose";
 
export interface IFieldDef {
  name:         string;
  type:         "string" | "number" | "boolean" | "date" | "enum" | "relation" | "array" | "mixed";
  required:     boolean;
  unique?:      boolean;
  default?:     any;
  options?:     string[];
  relation?:    string;
  multiple?:    boolean;
  arrayOf?:     "string" | "number" | "boolean";
  validators?:  { type: string; value: any; message: string }[];
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
}
 
export interface ISchemaDefinition extends Document {
  name:      string;
  label:     string;
  icon?:     string;
  fields:    IFieldDef[];
  createdAt: Date;
  updatedAt: Date;
}
 
const FieldDefSchema = new Schema<IFieldDef>({
  name:         { type: String, required: true },
  type:         { type: String, required: true,
                  enum: ["string","number","boolean","date","enum","relation","array","mixed"] },
  required:     { type: Boolean, default: false },
  unique:       { type: Boolean, default: false },
  default:      { type: Schema.Types.Mixed },
  options:      [String],
  relation:     String,
  multiple:     Boolean,
  arrayOf:      String,
  validators:   [{ type: String, value: Schema.Types.Mixed, message: String }],
  label:        String,
  placeholder:  String,
  helpText:     String,
  colSpan:      Number,
  order:        { type: Number, default: 0 },
  showInTable:  { type: Boolean, default: true },
  showInForm:   { type: Boolean, default: true },
  readOnly:     { type: Boolean, default: false },
  hidden:       { type: Boolean, default: false },
}, { _id: false });
 
const SchemaDefinitionSchema = new Schema<ISchemaDefinition>({
  name:   { type: String, required: true, unique: true },
  label:  { type: String, required: true },
  icon:   String,
  fields: [FieldDefSchema],
}, { timestamps: true });
 
export const SchemaDefinition = mongoose.model<ISchemaDefinition>(
  "SchemaDefinition",
  SchemaDefinitionSchema,
  "_schemas"
);
 