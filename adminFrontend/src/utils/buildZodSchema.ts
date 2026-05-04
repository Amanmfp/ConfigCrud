// utils/buildZodSchema.ts — fixed for Zod v4

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
        schema = field.nullable
          ? z.string().optional()
          : z.string().min(1, `${label(field)} is required`); // ← v4: plain string, not { message }
        break;

      case "number":
        // Zod v4: use z.coerce.number() instead of union+transform+pipe
        // invalid_type_error is gone — use error: { message } or just a string
        schema = z.coerce.number({
          error: `${label(field)} must be a valid number`, // ← v4 syntax
        });
        if (!field.nullable) {
          schema = (schema as z.ZodNumber).refine(
            (val) => !isNaN(val),
            `${label(field)} is required`  // ← v4: plain string
          );
        } else {
          schema = schema.optional();
        }
        break;

      case "boolean":
        schema = z.boolean().optional().default(false);
        break;

      case "enum":
        // Zod v4: errorMap is gone — use error as a plain string
        // z.enum() takes a plain string[] now, no tuple cast needed
        const options = field.options ?? [];
        schema =
          options.length > 0
            ? z.enum(options as [string, ...string[]], `Select a valid ${label(field)}`) // ← v4: plain string as 2nd arg
            : z.string();
        if (field.nullable) schema = schema.optional();
        break;

      case "relation":
        if (field.multiple) {
          schema = z.array(z.number()).optional().default([]);
        } else {
          // Zod v4: invalid_type_error gone — use error
          schema = z.coerce.number({
            error: `${label(field)} is required`, // ← v4 syntax
          });
          if (field.nullable) schema = schema.optional();
        }
        break;

      case "date":
        schema = field.nullable
          ? z.string().optional()
          : z.string().min(1, `${label(field)} is required`);
        break;

      default:
        schema = z.any();
    }

    shape[field.name] = schema;
  }

  return z.object(shape);
};