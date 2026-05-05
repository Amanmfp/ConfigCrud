"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SchemaDefinition_1 = require("../models/SchemaDefinition");
const dynamicModel_service_1 = require("../services/dynamicModel.service");
const router = (0, express_1.Router)();
// GET /api/meta/models — list all model definitions (for builder page)
router.get("/models", async (req, res) => {
    try {
        const schemas = await SchemaDefinition_1.SchemaDefinition.find();
        res.json(schemas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/meta/models/:name — get one model definition
router.get("/models/:name", async (req, res) => {
    try {
        const schema = await SchemaDefinition_1.SchemaDefinition.findOne({ name: req.params.name });
        if (!schema)
            return res.status(404).json({ error: "Model not found" });
        res.json(schema);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST /api/meta/models — create new model
router.post("/models", async (req, res) => {
    try {
        const { name, label, icon, fields } = req.body;
        if (!/^[a-z][a-z0-9_]*$/.test(name)) {
            return res.status(400).json({ error: "Model name must be lowercase letters, numbers, or underscores" });
        }
        const existing = await SchemaDefinition_1.SchemaDefinition.findOne({ name });
        if (existing)
            return res.status(400).json({ error: `Model "${name}" already exists` });
        const schemaDef = await SchemaDefinition_1.SchemaDefinition.create({ name, label, icon, fields });
        (0, dynamicModel_service_1.buildDynamicModel)(schemaDef);
        res.status(201).json(schemaDef);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// PUT /api/meta/models/:name — update model schema
router.put("/models/:name", async (req, res) => {
    try {
        const { label, icon, fields } = req.body;
        const schemaDef = await SchemaDefinition_1.SchemaDefinition.findOneAndUpdate({ name: req.params.name }, { label, icon, fields }, { new: true });
        if (!schemaDef)
            return res.status(404).json({ error: "Model not found" });
        (0, dynamicModel_service_1.invalidateModel)(req.params.name);
        (0, dynamicModel_service_1.buildDynamicModel)(schemaDef);
        res.json(schemaDef);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE /api/meta/models/:name — delete model + optionally its data
router.delete("/models/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const { deleteData = "false" } = req.query;
        const schema = await SchemaDefinition_1.SchemaDefinition.findOne({ name });
        if (!schema)
            return res.status(404).json({ error: "Model not found" });
        if (deleteData === "true") {
            const Model = await (0, dynamicModel_service_1.getDynamicModel)(name);
            if (Model)
                await Model.deleteMany({});
        }
        await SchemaDefinition_1.SchemaDefinition.deleteOne({ name });
        (0, dynamicModel_service_1.invalidateModel)(name);
        res.json({ success: true, message: `Model "${name}" deleted` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
