// utils/buildZodSchema.ts

import { z } from "zod";
import type { Field } from "../types/schema";

const label = (field: Field) => field.label ?? field.name;

export const buildZodSchema = (fields: Field[]): z.ZodObject<any> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    if (field.hidden || field.readOnly || field.showInForm === false) continue;

    let schema: z.ZodTypeAny;

    switch (field.type) {
      case "string":
        schema = field.required
          ? z.string().min(1, `${label(field)} is required`)
          : z.string().optional();
        break;

      case "number":
        schema = z.coerce.number({
          error: `${label(field)} must be a valid number`,
        });
        if (field.required) {
          schema = (schema as z.ZodNumber).refine(
            (val) => !isNaN(val),
            `${label(field)} is required`
          );
        } else {
          schema = schema.optional();
        }
        break;

      case "boolean":
        schema = z.boolean().optional().default(false);
        break;

      case "enum": {
        const options = field.options ?? [];
        schema =
          options.length > 0
            ? z.enum(options as [string, ...string[]], `Select a valid ${label(field)}`)
            : z.string();
        if (!field.required) schema = schema.optional();
        break;
      }

      case "relation":
        if (field.multiple) {
          schema = field.required
            ? z.array(z.string()).min(1, `${label(field)} is required`)
            : z.array(z.string()).optional().default([]);
        } else {
          schema = field.required
            ? z.string().min(1, `${label(field)} is required`)
            : z.string().optional();
        }
        break;

      case "date":
        schema = field.required
          ? z.string().min(1, `${label(field)} is required`)
          : z.string().optional();
        break;

      default:
        schema = z.any();
    }

    shape[field.name] = schema;
  }

  return z.object(shape);
};