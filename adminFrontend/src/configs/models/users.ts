import type { ModelUIConfig } from "../../types/schema";

export const usersUIConfig: ModelUIConfig = {
  id: { hidden: true },

  name: {
    label: "Full Name",
    order: 1,
  },

  email: {
    label: "Email",
    order: 2,
  },

  phone: {
    label: "Phone",
    order: 3,
    showInTable: false,
  },

  password: {
    label: "Password",
    order: 4,
    showInTable: false, // never show in table
  },

  role: {
    label: "Role",
    order: 5,
  },

  isActive: {
    label: "Active",
    order: 6,
  },

  // Address (form-heavy → hide in table)
  address: {
    label: "Address",
    order: 7,
    colSpan: 2,
    showInTable: false,
  },

  city: {
    label: "City",
    order: 8,
    showInTable: false,
  },

  postalCode: {
    label: "Postal Code",
    order: 9,
    showInTable: false,
  },

  country: {
    label: "Country",
    order: 10,
    showInTable: false,
  },

  avatar: {
    label: "Avatar URL",
    order: 11,
    showInTable: false,
  },

  createdAt: {
    label: "Created At",
    order: 12,
    showInForm: false,
    readOnly: true,
  },

  updatedAt: {
    hidden: true,
  },
};