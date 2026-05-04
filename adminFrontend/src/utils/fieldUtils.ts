import type { Field } from "../types/schema";
 
// "firstName" → "First Name", "created_at" → "Created At"
export const toLabel = (name: string): string =>
  name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
 
export const getLabel = (field: Field): string =>
  field.label ?? toLabel(field.name);
 
export const getVisibleTableFields = (fields: Field[]) =>
  fields
    .filter((f) => !f.hidden && f.showInTable !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
 
export const getVisibleFormFields = (fields: Field[]) =>
  fields
    .filter((f) => !f.hidden && f.showInForm !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
 