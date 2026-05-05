import express, { Request, Response, NextFunction } from "express";
import cors         from "cors";
import mongoose     from "mongoose";
import dotenv       from "dotenv";
import metaRoutes   from "./routes/meta.routes";
import dataRoutes   from "./routes/data.routes";
import { SchemaDefinition } from "./models/SchemaDefinition";
import { buildDynamicModel } from "./services/dynamicModel.service";
 
dotenv.config();
 
const app  = express();
const PORT = process.env.PORT || 3000;  // ← keeps your existing PORT 3000
 
// ── Middleware (same as your server.js) ───────────────────────────
app.use(cors({
  origin:  "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
}));
app.use(express.json());
 
 
// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (req: Request, res: Response) => {
  const stateMap: Record<number, string> = {
    0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting",
  };
  const state  = mongoose.connection.readyState;
  const isOk   = state === 1;
 
  res.status(isOk ? 200 : 503).json({
    status:    isOk ? "ok" : "degraded",
    database:  stateMap[state] ?? "unknown",
    uptime:    `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});
 
 
// ── Routes ────────────────────────────────────────────────────────
// ⚠️ ORDER MATTERS: meta before data
// so /api/meta/models doesn't match /api/:model
app.use("/api/meta", metaRoutes);   // model builder API
app.use("/api",      dataRoutes);   // data + schema API
 
 
// ── 404 handler (same as your server.js) ─────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});
 
 
// ── Error handler (same as your server.js) ───────────────────────
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});
 
 
// ── DB + Server start ─────────────────────────────────────────────
const start = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/admin_panel";
 
    mongoose.connection.on("connected",    () => console.log("✅ MongoDB connected"));
    mongoose.connection.on("disconnected", () => console.log("⚠️  MongoDB disconnected"));
    mongoose.connection.on("error",  (err) => console.error("❌ MongoDB error:", err.message));
 
    await mongoose.connect(uri);
 
    // Pre-build all dynamic models so first request has no cold start
    const schemas = await SchemaDefinition.find();
    if (schemas.length === 0) {
      console.log("ℹ️  No models found in DB — seed some via /api/meta/models");
    }
    for (const schema of schemas) {
      buildDynamicModel(schema);
      console.log(`  ✓ Loaded model: ${schema.name}`);
    }
 
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health:  GET http://localhost:${PORT}/api/health`);
      console.log(`📦 Models:  GET http://localhost:${PORT}/api/models`);
      console.log(`🔧 Builder: GET http://localhost:${PORT}/api/meta/models`);
    });
 
  } catch (err: any) {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  }
};
 
start();
 
export default app;