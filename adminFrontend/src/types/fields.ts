import type { Field } from "./schema";
import type {
  UseFormRegister,
  Control,
  FieldError,
} from "react-hook-form";
 
export type FieldProps = {
  field: Field;
  // RHF props — passed down from FormRenderer
  register: UseFormRegister<any>;
  control: Control<any>;
  error?: FieldError;
  // kept for RelationField and BooleanField which use Controller
  value?: any;
  onChange?: (name: string, value: any) => void;
};
 