import type { Field } from "./schema";
import type {
  UseFormRegister,
  Control,
  FieldError,
} from "react-hook-form";
 
export type FieldProps = {
  field: Field;
  register: UseFormRegister<any>;
  control: Control<any>;
  error?: FieldError;
};
 