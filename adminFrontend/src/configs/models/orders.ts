import type { ModelUIConfig } from "../../types/schema";

export const ordersUIConfig: ModelUIConfig = {
  id: { hidden: true },

  orderNumber: {
    label: "Order #",
    order: 1,
  },

  status: {
    label: "Status",
    order: 2,
  },

  userId: {
    label: "Customer",
    order: 3,
    hidden:true
  },

  productIds: {
    label: "Products",
    order: 4,
    hidden:true,
    showInTable: false,
  },

  // Pricing
  totalAmount: {
    label: "Total (₹)",
    order: 5,
    showInForm: false, // calculated
    readOnly: true,
  },

  discount: {
    label: "Discount (₹)",
    order: 6,
  },

  tax: {
    label: "Tax (₹)",
    order: 7,
    showInForm: false,
    readOnly: true,
  },

  finalAmount: {
    label: "Final Amount (₹)",
    order: 8,
    showInForm: false,
    readOnly: true,
  },

  // Payment
  paymentMethod: {
    label: "Payment Method",
    order: 9,
  },

  paymentStatus: {
    label: "Payment Status",
    order: 10,
  },

  // Shipping → usually form-heavy → hide from table
  shippingAddress: {
    label: "Shipping Address",
    order: 11,
    colSpan: 2,
    showInTable: false,
  },

  city: {
    label: "City",
    order: 12,
    showInTable: false,
  },

  postalCode: {
    label: "Postal Code",
    order: 13,
    showInTable: false,
  },

  country: {
    label: "Country",
    order: 14,
    showInTable: false,
  },

  // Tracking
  trackingId: {
    label: "Tracking ID",
    order: 15,
    showInTable: false,
  },

  // timestamps
  createdAt: {
    label: "Created At",
    order: 16,
    showInForm: false,
    readOnly: true,
  },

  updatedAt: {
    hidden: true,
  },
};