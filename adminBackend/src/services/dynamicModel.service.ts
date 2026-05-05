import mongoose, { Schema } from "mongoose";
import { SchemaDefinition, type IFieldDef, type ISchemaDefinition } from "../models/SchemaDefinition";
 
const modelCache = new Map<string, mongoose.Model<any>>();
 
const buildMongooseField = (field: IFieldDef): any => {
  switch (field.type) {
    case "string": {
      const f: any = { type: String };
      if (field.required) f.required = [true, `${field.label ?? field.name} is required`];
      if (field.unique)   f.unique   = true;
      if (field.default !== undefined) f.default = field.default;
      if (field.validators?.length) {
        f.validate = field.validators.map((v) => {
          if (v.type === "minLength") return { validator: (val: string) => val.length >= v.value, message: v.message };
          if (v.type === "maxLength") return { validator: (val: string) => val.length <= v.value, message: v.message };
          if (v.type === "match")     return { validator: (val: string) => new RegExp(v.value).test(val), message: v.message };
          return null;
        }).filter(Boolean);
      }
      return f;
    }
    case "number": {
      const f: any = { type: Number };
      if (field.required) f.required = true;
      if (field.default !== undefined) f.default = field.default;
      if (field.validators?.length) {
        f.validate = field.validators.map((v) => {
          if (v.type === "min") return { validator: (val: number) => val >= v.value, message: v.message };
          if (v.type === "max") return { validator: (val: number) => val <= v.value, message: v.message };
          return null;
        }).filter(Boolean);
      }
      return f;
    }
    case "boolean":  return { type: Boolean, default: field.default ?? false };
    case "date":     return { type: Date, required: field.required ?? false };
    case "enum":     return { type: String, enum: { values: field.options ?? [], message: "{VALUE} is not valid" }, required: field.required };
    case "relation":
      return field.multiple
        ? [{ type: Schema.Types.ObjectId, ref: field.relation }]
        : { type: Schema.Types.ObjectId, ref: field.relation };
    case "array": {
      const itemType = field.arrayOf === "number" ? Number : field.arrayOf === "boolean" ? Boolean : String;
      return [{ type: itemType }];
    }
    case "mixed":    return Schema.Types.Mixed;
    default:         return Schema.Types.Mixed;
  }
};
 
export const buildDynamicModel = (schemaDef: ISchemaDefinition): mongoose.Model<any> => {
  if (modelCache.has(schemaDef.name)) return modelCache.get(schemaDef.name)!;
 
  const shape: Record<string, any> = {};
  for (const field of schemaDef.fields) {
    shape[field.name] = buildMongooseField(field);
  }
 
  const mongooseSchema = new Schema(shape, { timestamps: true });
  const model = mongoose.model(schemaDef.name, mongooseSchema, schemaDef.name);
  modelCache.set(schemaDef.name, model);
  return model;
};
 
export const invalidateModel = (modelName: string) => {
  modelCache.delete(modelName);
  if (mongoose.modelNames().includes(modelName)) {
    delete (mongoose.connection.models as any)[modelName];
  }
};
 
export const getDynamicModel = async (modelName: string): Promise<mongoose.Model<any> | null> => {
  if (modelCache.has(modelName)) return modelCache.get(modelName)!;
  const schemaDef = await SchemaDefinition.findOne({ name: modelName });
  if (!schemaDef) return null;
  return buildDynamicModel(schemaDef);
};
 