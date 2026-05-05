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
// ── GET /api/models — sidebar model list ──────────────────────────
// Replaces: hardcoded users/products/orders in sidebar
router.get("/models", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schemas = yield SchemaDefinition_1.SchemaDefinition.find({}, { name: 1, label: 1, icon: 1 });
        res.json(schemas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// ── GET /api/schema/:model — field definitions ────────────────────
// Replaces: schema/users.js, schema/products.js, schema/orders.js
// Your frontend calls this same URL — zero change needed
router.get("/schema/:model", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = yield SchemaDefinition_1.SchemaDefinition.findOne({ name: req.params.model });
        if (!schema)
            return res.status(404).json({ error: "Schema not found" });
        res.json(schema);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// ── GET /api/:model/:id — fetch one record (for view/edit pages) ───
router.get("/:model/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Model = yield (0, dynamicModel_service_1.getDynamicModel)(req.params.model);
        if (!Model)
            return res.status(404).json({ error: `Model "${req.params.model}" not found` });
        const doc = yield Model.findById(req.params.id).lean();
        if (!doc)
            return res.status(404).json({ error: "Record not found" });
        res.json(doc);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// ── GET /api/:model — list all records ────────────────────────────
// Replaces: router.get("/users"), router.get("/products"), router.get("/orders")
// One generic route handles ALL models now
router.get("/:model", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Model = yield (0, dynamicModel_service_1.getDynamicModel)(req.params.model);
        if (!Model)
            return res.status(404).json({ error: `Model "${req.params.model}" not found` });
        const { page = "1", limit = "50", search = "", sortBy = "createdAt", order = "desc", } = req.query;
        const filter = search
            ? { $or: [{ name: { $regex: search, $options: "i" } }] }
            : {};
        const data = yield Model
            .find(filter)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();
        const total = yield Model.countDocuments(filter);
        res.json({ data, total, page: Number(page), limit: Number(limit) });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// ── POST /api/:model — create record ──────────────────────────────
// Replaces: router.post("/users"), router.post("/products"), router.post("/orders")
router.post("/:model", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Model = yield (0, dynamicModel_service_1.getDynamicModel)(req.params.model);
        if (!Model)
            return res.status(404).json({ error: `Model "${req.params.model}" not found` });
        const doc = yield Model.create(req.body);
        res.status(201).json(doc);
    }
    catch (err) {
        // Mongoose validation errors → 400 with field details
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: "Validation failed", details: messages });
        }
        res.status(500).json({ error: err.message });
    }
}));
// ── PUT /api/:model/:id — update record ───────────────────────────
// Replaces: router.put("/:model/:id")
// Same URL pattern — zero frontend change needed
router.put("/:model/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Model = yield (0, dynamicModel_service_1.getDynamicModel)(req.params.model);
        if (!Model)
            return res.status(404).json({ error: `Model "${req.params.model}" not found` });
        const doc = yield Model.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { updatedAt: new Date() }), { new: true, runValidators: true });
        if (!doc)
            return res.status(404).json({ error: "Record not found" });
        res.json(doc);
    }
    catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: "Validation failed", details: messages });
        }
        res.status(500).json({ error: err.message });
    }
}));
// ── DELETE /api/:model/:id — delete record ────────────────────────
// Replaces: router.delete("/:model/:id")
// Same URL pattern — zero frontend change needed
router.delete("/:model/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Model = yield (0, dynamicModel_service_1.getDynamicModel)(req.params.model);
        if (!Model)
            return res.status(404).json({ error: `Model "${req.params.model}" not found` });
        const doc = yield Model.findByIdAndDelete(req.params.id);
        if (!doc)
            return res.status(404).json({ error: "Record not found" });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
