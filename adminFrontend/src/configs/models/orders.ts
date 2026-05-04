import type { Field } from "../../types/schema";
 
export const ordersFields: Field[] = [
  {
    name: "id", type: "number", hidden: true,
    nullable: false
  },
  {
    name: "orderNo", type: "string", label: "Order #", order: 1,
    nullable: false
  },
  {
    name: "status", type: "enum", label: "Status", order: 2,
    options: ["pending", "processing", "shipped", "delivered", "cancelled"],
    nullable: false
  },
  {
    name: "userId", type: "relation", relation: "users", label: "Customer", order: 3,
    nullable: false
  },
  {
    name: "total", type: "number", label: "Total (₹)", order: 4, showInForm: false, readOnly: true,
    nullable: false
  },
  {
    name: "notes", type: "string", label: "Notes", order: 5, colSpan: 2,
    nullable: false
  },
  {
    name: "createdAt", type: "string", label: "Ordered On", order: 6, showInForm: false, readOnly: true,
    nullable: false
  },
  {
    name: "updatedAt", type: "string", hidden: true,
    nullable: false
  },
];
