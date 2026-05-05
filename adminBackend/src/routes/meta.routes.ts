import { Router, Request, Response } from "express";
import { SchemaDefinition } from "../models/SchemaDefinition";
import { buildDynamicModel, invalidateModel, getDynamicModel } from "../services/dynamicModel.service";
 
const router = Router();
const FIELD_TYPES = new Set(["string","number","boolean","date","enum","relation","array","mixed"]);

type ValidationIssue = { path: string; message: string };

const isNonEmptyString = (v: any) => typeof v === "string" && v.trim().length > 0;

const validateModelPayload = async (payload: any, opts: { mode: "create" | "update"; modelName?: string }) => {
  const issues: ValidationIssue[] = [];

  const name = opts.mode === "create" ? payload?.name : opts.modelName;
  const label = payload?.label;
  const fields = payload?.fields;

  if (opts.mode === "create") {
    if (!isNonEmptyString(payload?.name)) issues.push({ path: "name", message: "Model name is required" });
    else if (!/^[a-z][a-z0-9_]*$/.test(payload.name))
      issues.push({ path: "name", message: "Model name must be lowercase letters, numbers, or underscores" });
  }

  if (!isNonEmptyString(label)) issues.push({ path: "label", message: "Display label is required" });

  if (!Array.isArray(fields) || fields.length === 0) {
    issues.push({ path: "fields", message: "At least one field is required" });
    return issues;
  }

  // Validate per-field shape
  const seen = new Set<string>();
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    const base = `fields[${i}]`;

    if (!isNonEmptyString(f?.name)) issues.push({ path: `${base}.name`, message: "Field name is required" });
    else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(f.name))
      issues.push({ path: `${base}.name`, message: "Invalid field name" });
    else {
      const key = String(f.name);
      if (seen.has(key)) issues.push({ path: `${base}.name`, message: "Duplicate field name" });
      seen.add(key);
    }

    if (!isNonEmptyString(f?.type) || !FIELD_TYPES.has(f.type))
      issues.push({ path: `${base}.type`, message: "Invalid field type" });

    if (f?.type === "enum") {
      if (!Array.isArray(f?.options) || f.options.length === 0)
        issues.push({ path: `${base}.options`, message: "Enum options are required" });
    }

    if (f?.type === "array") {
      if (!["string", "number", "boolean"].includes(f?.arrayOf))
        issues.push({ path: `${base}.arrayOf`, message: "Array item type must be one of: string, number, boolean" });
    }

    if (f?.type === "relation") {
      if (!isNonEmptyString(f?.relation))
        issues.push({ path: `${base}.relation`, message: "Related model is required" });
      else if (name && f.relation === name)
        issues.push({ path: `${base}.relation`, message: "Related model cannot be the same as this model" });
    }
  }

  // Validate relation targets exist (only if no earlier relation-shape issues)
  const relationTargets = fields
    .filter((f: any) => f?.type === "relation" && isNonEmptyString(f?.relation))
    .map((f: any) => String(f.relation));
  const uniqueTargets = [...new Set(relationTargets)];
  if (uniqueTargets.length) {
    const existing = await SchemaDefinition.find({ name: { $in: uniqueTargets } }, { name: 1 }).lean();
    const existingSet = new Set(existing.map((m: any) => m.name));
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (f?.type !== "relation" || !isNonEmptyString(f?.relation)) continue;
      if (!existingSet.has(String(f.relation))) {
        issues.push({ path: `fields[${i}].relation`, message: `Related model "${f.relation}" does not exist` });
      }
    }
  }

  return issues;
};
 
// GET /api/meta/models — list all model definitions (for builder page)
router.get("/models", async (req: Request, res: Response) => {
  try {
    const schemas = await SchemaDefinition.find();
    res.json(schemas);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/meta/models/:name — get one model definition
router.get("/models/:name", async (req: Request, res: Response) => {
  try {
    const schema = await SchemaDefinition.findOne({ name: req.params.name });
    if (!schema) return res.status(404).json({ error: "Model not found" });
    res.json(schema);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
// POST /api/meta/models — create new model
router.post("/models", async (req: Request, res: Response) => {
  try {
    const { name, label, icon, fields } = req.body;
    const issues = await validateModelPayload({ name, label, icon, fields }, { mode: "create" });
    if (issues.length) return res.status(400).json({ error: "Validation failed", details: issues });
 
    if (!/^[a-z][a-z0-9_]*$/.test(name)) {
      return res.status(400).json({ error: "Model name must be lowercase letters, numbers, or underscores" });
    }
 
    const existing = await SchemaDefinition.findOne({ name });
    if (existing) return res.status(400).json({ error: `Model "${name}" already exists` });
 
    const schemaDef = await SchemaDefinition.create({ name, label, icon, fields });
    buildDynamicModel(schemaDef);
 
    res.status(201).json(schemaDef);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
// PUT /api/meta/models/:name — update model schema
router.put(
  "/models/:name",
  async (req: Request<{ name: string }>, res: Response) => {
  try {
    const { label, icon, fields } = req.body;
    const issues = await validateModelPayload({ label, icon, fields }, { mode: "update", modelName: req.params.name });
    if (issues.length) return res.status(400).json({ error: "Validation failed", details: issues });
 
    const schemaDef = await SchemaDefinition.findOneAndUpdate(
      { name: req.params.name },
      { label, icon, fields },
      { new: true }
    );
    if (!schemaDef) return res.status(404).json({ error: "Model not found" });
 
    invalidateModel(req.params.name);
    buildDynamicModel(schemaDef);
 
    res.json(schemaDef);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
// DELETE /api/meta/models/:name — delete model + optionally its data
router.delete(
  "/models/:name",
  async (req: Request<{ name: string }>, res: Response) => {
  try {
    const { name }            = req.params;
    const { deleteData = "false" } = req.query as Record<string, string>;
 
    const schema = await SchemaDefinition.findOne({ name });
    if (!schema) return res.status(404).json({ error: "Model not found" });
 
    if (deleteData === "true") {
      const Model = await getDynamicModel(name);
      if (Model) await Model.deleteMany({});
    }
 
    await SchemaDefinition.deleteOne({ name });
    invalidateModel(name);
 
    res.json({ success: true, message: `Model "${name}" deleted` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
export default router;