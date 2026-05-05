"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SchemaDefinition_1 = require("../models/SchemaDefinition");
const dynamicModel_service_1 = require("../services/dynamicModel.service");
const router = (0, express_1.Router)();
const FIELD_TYPES = new Set(["string", "number", "boolean", "date", "enum", "relation", "array", "mixed"]);
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const validateModelPayload = (payload, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const issues = [];
    const name = opts.mode === "create" ? payload === null || payload === void 0 ? void 0 : payload.name : opts.modelName;
    const label = payload === null || payload === void 0 ? void 0 : payload.label;
    const fields = payload === null || payload === void 0 ? void 0 : payload.fields;
    if (opts.mode === "create") {
        if (!isNonEmptyString(payload === null || payload === void 0 ? void 0 : payload.name))
            issues.push({ path: "name", message: "Model name is required" });
        else if (!/^[a-z][a-z0-9_]*$/.test(payload.name))
            issues.push({ path: "name", message: "Model name must be lowercase letters, numbers, or underscores" });
    }
    if (!isNonEmptyString(label))
        issues.push({ path: "label", message: "Display label is required" });
    if (!Array.isArray(fields) || fields.length === 0) {
        issues.push({ path: "fields", message: "At least one field is required" });
        return issues;
    }
    // Validate per-field shape
    const seen = new Set();
    for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        const base = `fields[${i}]`;
        if (!isNonEmptyString(f === null || f === void 0 ? void 0 : f.name))
            issues.push({ path: `${base}.name`, message: "Field name is required" });
        else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(f.name))
            issues.push({ path: `${base}.name`, message: "Invalid field name" });
        else {
            const key = String(f.name);
            if (seen.has(key))
                issues.push({ path: `${base}.name`, message: "Duplicate field name" });
            seen.add(key);
        }
        if (!isNonEmptyString(f === null || f === void 0 ? void 0 : f.type) || !FIELD_TYPES.has(f.type))
            issues.push({ path: `${base}.type`, message: "Invalid field type" });
        if ((f === null || f === void 0 ? void 0 : f.type) === "enum") {
            if (!Array.isArray(f === null || f === void 0 ? void 0 : f.options) || f.options.length === 0)
                issues.push({ path: `${base}.options`, message: "Enum options are required" });
        }
        if ((f === null || f === void 0 ? void 0 : f.type) === "array") {
            if (!["string", "number", "boolean"].includes(f === null || f === void 0 ? void 0 : f.arrayOf))
                issues.push({ path: `${base}.arrayOf`, message: "Array item type must be one of: string, number, boolean" });
        }
        if ((f === null || f === void 0 ? void 0 : f.type) === "relation") {
            if (!isNonEmptyString(f === null || f === void 0 ? void 0 : f.relation))
                issues.push({ path: `${base}.relation`, message: "Related model is required" });
            else if (name && f.relation === name)
                issues.push({ path: `${base}.relation`, message: "Related model cannot be the same as this model" });
        }
    }
    // Validate relation targets exist (only if no earlier relation-shape issues)
    const relationTargets = fields
        .filter((f) => (f === null || f === void 0 ? void 0 : f.type) === "relation" && isNonEmptyString(f === null || f === void 0 ? void 0 : f.relation))
        .map((f) => String(f.relation));
    const uniqueTargets = [...new Set(relationTargets)];
    if (uniqueTargets.length) {
        const existing = yield SchemaDefinition_1.SchemaDefinition.find({ name: { $in: uniqueTargets } }, { name: 1 }).lean();
        const existingSet = new Set(existing.map((m) => m.name));
        for (let i = 0; i < fields.length; i++) {
            const f = fields[i];
            if ((f === null || f === void 0 ? void 0 : f.type) !== "relation" || !isNonEmptyString(f === null || f === void 0 ? void 0 : f.relation))
                continue;
            if (!existingSet.has(String(f.relation))) {
                issues.push({ path: `fields[${i}].relation`, message: `Related model "${f.relation}" does not exist` });
            }
        }
    }
    return issues;
});
// GET /api/meta/models — list all model definitions (for builder page)
router.get("/models", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schemas = yield SchemaDefinition_1.SchemaDefinition.find();
        res.json(schemas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// GET /api/meta/models/:name — get one model definition
router.get("/models/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = yield SchemaDefinition_1.SchemaDefinition.findOne({ name: req.params.name });
        if (!schema)
            return res.status(404).json({ error: "Model not found" });
        res.json(schema);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// POST /api/meta/models — create new model
router.post("/models", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, label, icon, fields } = req.body;
        const issues = yield validateModelPayload({ name, label, icon, fields }, { mode: "create" });
        if (issues.length)
            return res.status(400).json({ error: "Validation failed", details: issues });
        if (!/^[a-z][a-z0-9_]*$/.test(name)) {
            return res.status(400).json({ error: "Model name must be lowercase letters, numbers, or underscores" });
        }
        const existing = yield SchemaDefinition_1.SchemaDefinition.findOne({ name });
        if (existing)
            return res.status(400).json({ error: `Model "${name}" already exists` });
        const schemaDef = yield SchemaDefinition_1.SchemaDefinition.create({ name, label, icon, fields });
        (0, dynamicModel_service_1.buildDynamicModel)(schemaDef);
        res.status(201).json(schemaDef);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// PUT /api/meta/models/:name — update model schema
router.put("/models/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { label, icon, fields } = req.body;
        const issues = yield validateModelPayload({ label, icon, fields }, { mode: "update", modelName: req.params.name });
        if (issues.length)
            return res.status(400).json({ error: "Validation failed", details: issues });
        const schemaDef = yield SchemaDefinition_1.SchemaDefinition.findOneAndUpdate({ name: req.params.name }, { label, icon, fields }, { new: true });
        if (!schemaDef)
            return res.status(404).json({ error: "Model not found" });
        (0, dynamicModel_service_1.invalidateModel)(req.params.name);
        (0, dynamicModel_service_1.buildDynamicModel)(schemaDef);
        res.json(schemaDef);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// DELETE /api/meta/models/:name — delete model + optionally its data
router.delete("/models/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const { deleteData = "false" } = req.query;
        const schema = yield SchemaDefinition_1.SchemaDefinition.findOne({ name });
        if (!schema)
            return res.status(404).json({ error: "Model not found" });
        if (deleteData === "true") {
            const Model = yield (0, dynamicModel_service_1.getDynamicModel)(name);
            if (Model)
                yield Model.deleteMany({});
        }
        yield SchemaDefinition_1.SchemaDefinition.deleteOne({ name });
        (0, dynamicModel_service_1.invalidateModel)(name);
        res.json({ success: true, message: `Model "${name}" deleted` });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
