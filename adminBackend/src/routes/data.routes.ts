import { Router, Request, Response } from "express";
import { SchemaDefinition } from "../models/SchemaDefinition";
import { getDynamicModel } from "../services/dynamicModel.service";
 
const router = Router();
 
// ── GET /api/models — sidebar model list ──────────────────────────
// Replaces: hardcoded users/products/orders in sidebar
router.get("/models", async (req: Request, res: Response) => {
  try {
    const schemas = await SchemaDefinition.find({}, { name: 1, label: 1, icon: 1 });
    res.json(schemas);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
// ── GET /api/schema/:model — field definitions ────────────────────
// Replaces: schema/users.js, schema/products.js, schema/orders.js
// Your frontend calls this same URL — zero change needed
router.get("/schema/:model", async (req: Request, res: Response) => {
  try {
    const schema = await SchemaDefinition.findOne({ name: req.params.model });
    if (!schema) return res.status(404).json({ error: "Schema not found" });
    res.json(schema);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
// ── GET /api/:model — list all records ────────────────────────────
// Replaces: router.get("/users"), router.get("/products"), router.get("/orders")
// One generic route handles ALL models now
router.get("/:model", async (req: Request<{ model: string }>, res: Response) => {
  try {
    const Model = await getDynamicModel(req.params.model);
    if (!Model) return res.status(404).json({ error: `Model "${req.params.model}" not found` });
 
    const {
      page     = "1",
      limit    = "50",
      search   = "",
      sortBy   = "createdAt",
      order    = "desc",
    } = req.query as Record<string, string>;
 
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }] }
      : {};
 
    const data = await Model
      .find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();
 
    const total = await Model.countDocuments(filter);
 
    res.json({ data, total, page: Number(page), limit: Number(limit) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
// ── POST /api/:model — create record ──────────────────────────────
// Replaces: router.post("/users"), router.post("/products"), router.post("/orders")
router.post("/:model", async (req: Request<{ model: string }>, res: Response) => {
  try {
    const Model = await getDynamicModel(req.params.model);
    if (!Model) return res.status(404).json({ error: `Model "${req.params.model}" not found` });
 
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  } catch (err: any) {
    // Mongoose validation errors → 400 with field details
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    res.status(500).json({ error: err.message });
  }
});
 
// ── PUT /api/:model/:id — update record ───────────────────────────
// Replaces: router.put("/:model/:id")
// Same URL pattern — zero frontend change needed
router.put(
  "/:model/:id",
  async (req: Request<{ model: string; id: string }>, res: Response) => {
  try {
    const Model = await getDynamicModel(req.params.model);
    if (!Model) return res.status(404).json({ error: `Model "${req.params.model}" not found` });
 
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Record not found" });
    res.json(doc);
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    res.status(500).json({ error: err.message });
  }
});
 
// ── DELETE /api/:model/:id — delete record ────────────────────────
// Replaces: router.delete("/:model/:id")
// Same URL pattern — zero frontend change needed
router.delete(
  "/:model/:id",
  async (req: Request<{ model: string; id: string }>, res: Response) => {
  try {
    const Model = await getDynamicModel(req.params.model);
    if (!Model) return res.status(404).json({ error: `Model "${req.params.model}" not found` });
 
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Record not found" });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
 
export default router;
 