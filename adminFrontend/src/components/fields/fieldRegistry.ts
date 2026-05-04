import type { ComponentType } from "react";
import type { FieldProps } from "../../types/fields";
import { StringField } from "./registry/StringField";
import { NumberField } from "./registry/NumberField";
import { BooleanField } from "./registry/BooleanField";
import { DateField } from "./registry/DateField";
import { EnumField } from "./registry/EnumField";
import RelationField from "./RelationField";
 
const fieldRegistry: Record<string, ComponentType<FieldProps>> = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  enum: EnumField,
  relation: RelationField,
};
 
export const registerField = (type: string, component: ComponentType<FieldProps>) => {
  fieldRegistry[type] = component;
};
 
export const getFieldComponent = (type: string): ComponentType<FieldProps> | null =>
  fieldRegistry[type] ?? null;