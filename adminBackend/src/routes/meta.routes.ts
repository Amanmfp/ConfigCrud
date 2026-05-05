import { Router, Request, Response } from "express";
import { SchemaDefinition } from "../models/SchemaDefinition";
import { buildDynamicModel, invalidateModel, getDynamicModel } from "../services/dynamicModel.service";
 
const router = Router();
 
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