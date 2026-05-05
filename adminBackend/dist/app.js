"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const meta_routes_1 = __importDefault(require("./routes/meta.routes"));
const data_routes_1 = __importDefault(require("./routes/data.routes"));
const SchemaDefinition_1 = require("./models/SchemaDefinition");
const dynamicModel_service_1 = require("./services/dynamicModel.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; // ← keeps your existing PORT 3000
// ── Middleware (same as your server.js) ───────────────────────────
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));
app.use(express_1.default.json());
// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    const stateMap = {
        0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting",
    };
    const state = mongoose_1.default.connection.readyState;
    const isOk = state === 1;
    res.status(isOk ? 200 : 503).json({
        status: isOk ? "ok" : "degraded",
        database: stateMap[state] ?? "unknown",
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
    });
});
// ── Routes ────────────────────────────────────────────────────────
// ⚠️ ORDER MATTERS: meta before data
// so /api/meta/models doesn't match /api/:model
app.use("/api/meta", meta_routes_1.default); // model builder API
app.use("/api", data_routes_1.default); // data + schema API
// ── 404 handler (same as your server.js) ─────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// ── Error handler (same as your server.js) ───────────────────────
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
});
// ── DB + Server start ─────────────────────────────────────────────
const start = async () => {
    try {
        const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/admin_panel";
        mongoose_1.default.connection.on("connected", () => console.log("✅ MongoDB connected"));
        mongoose_1.default.connection.on("disconnected", () => console.log("⚠️  MongoDB disconnected"));
        mongoose_1.default.connection.on("error", (err) => console.error("❌ MongoDB error:", err.message));
        await mongoose_1.default.connect(uri);
        // Pre-build all dynamic models so first request has no cold start
        const schemas = await SchemaDefinition_1.SchemaDefinition.find();
        if (schemas.length === 0) {
            console.log("ℹ️  No models found in DB — seed some via /api/meta/models");
        }
        for (const schema of schemas) {
            (0, dynamicModel_service_1.buildDynamicModel)(schema);
            console.log(`  ✓ Loaded model: ${schema.name}`);
        }
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 Health:  GET http://localhost:${PORT}/api/health`);
            console.log(`📦 Models:  GET http://localhost:${PORT}/api/models`);
            console.log(`🔧 Builder: GET http://localhost:${PORT}/api/meta/models`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start:", err.message);
        process.exit(1);
    }
};
start();
exports.default = app;
