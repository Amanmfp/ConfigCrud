import type { ModelUIConfig } from "../../types/schema";
 
export const usersUIConfig: ModelUIConfig = {
  id:        { hidden: true },
  firstName: { label: "First Name", order: 1, colSpan: 1 },
  lastName:  { label: "Last Name",  order: 2, colSpan: 1 },
  email:     { label: "Email Address", order: 3, colSpan: 2 },
  password:  { label: "Password", order: 4, showInTable: false, colSpan: 2 },
  isAdmin:   { label: "Admin Access", order: 5 },
  createdAt: { label: "Created", order: 6, showInForm: false, readOnly: true },
  updatedAt: { hidden: true },
};
 