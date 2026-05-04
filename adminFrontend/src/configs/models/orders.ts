import type { ModelUIConfig } from "../../types/schema";

export const ordersUIConfig: ModelUIConfig = {
  id: { hidden: true },

  orderNo: {
    label: "Order #",
    order: 1,
    colSpan: 1,
  },

  status: {
    label: "Status",
    order: 2,
  },

  userId: {
    label: "Customer",
    order: 3,
  },

  total: {
    label: "Total (₹)",
    order: 4,
    showInForm: false,
    readOnly: true,
  },

  notes: {
    label: "Notes",
    order: 5,
    colSpan: 2,
  },

  createdAt: {
    label: "Ordered On",
    order: 6,
    showInForm: false,
    readOnly: true,
  },

  updatedAt: {
    hidden: true,
  },
};