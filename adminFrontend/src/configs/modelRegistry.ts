import type { Field, ModelUIConfig } from "../types/schema";
import { productsUIConfig } from "./models/products";
import { usersUIConfig }    from "./models/users";
 
const uiRegistry: Record<string, ModelUIConfig> = {
  products: productsUIConfig,
  users:    usersUIConfig,
};
 
export const mergeWithUIConfig = (
  model: string,
  apiFields: Field[]
): Field[] => {
  const uiConfig = uiRegistry[model] ?? {};
 
  return apiFields.map((apiField) => ({
    ...apiField,                      // backend base
    ...uiConfig[apiField.name],       // UI overrides on top
 
    // backend-owned props always win — UI config can never touch these
    name:     apiField.name,
    type:     apiField.type,
    required: apiField.required,
    relation: apiField.relation,
    options:  apiField.options,
  }));
};