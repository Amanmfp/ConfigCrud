import type { ModelUIConfig } from "../../types/schema";
 
export const productsUIConfig: ModelUIConfig = {
  id:          { hidden: true },
  name:        { label: "Product Name",  order: 1, colSpan: 2 },
  sku:         { label: "SKU",           order: 2, colSpan: 1 },
  price:       { label: "Price (₹)",     order: 3, colSpan: 1 },
  description: { label: "Description",   order: 4, colSpan: 2 },
  // categoryId:  { label: "Category",      order: 5 },
  inStock:     { label: "In Stock",      order: 6 },
  createdAt:   { label: "Created",       order: 7, showInForm: false, readOnly: true },
  updatedAt:   { hidden: true },
};
 