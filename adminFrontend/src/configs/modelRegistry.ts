import type { Field, ModelUIConfig } from "../types/schema";
import { productsUIConfig } from "./models/products";
import { usersUIConfig }    from "./models/users";
import { ordersUIConfig } from "./models/orders"
 
const uiRegistry: Record<string, ModelUIConfig> = {
  products: productsUIConfig,
  users:    usersUIConfig,
  orders:  ordersUIConfig
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

export const registeredModels = [
  { name: "users",    label: "Users",    icon: "users"    },
  { name: "products", label: "Products", icon: "package"  },
  { name: "orders",   label: "Orders",   icon: "shopping" },
] as const;
 
export type RegisteredModel = typeof registeredModels[number];