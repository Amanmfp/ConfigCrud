// ================================================================
// src/seed.ts — seeds your existing hardcoded data into MongoDB
// Run ONCE: npx ts-node src/seed.ts
// ================================================================
 
import mongoose from "mongoose";
import dotenv   from "dotenv";
import { SchemaDefinition } from "./models/SchemaDefinition";
import { buildDynamicModel } from "./services/dynamicModel.service";
 
dotenv.config();
 
const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI ?? "mongodb://localhost:27017/admin_panel");
  console.log("Connected for seeding...");
 
  // ── Seed schema definitions ──────────────────────────────────────
  // These replace your schema/users.js, schema/products.js, schema/orders.js
  const schemaDefs = [
    {
      name:  "users",
      label: "Users",
      icon:  "users",
      fields: [
        { name: "name",      type: "string",  required: true,  label: "Name",       order: 1, colSpan: 1 },
        { name: "email",     type: "string",  required: true,  label: "Email",      order: 2, colSpan: 2,
          validators: [{ type: "match", value: "^[\\w.-]+@[\\w.-]+\\.\\w+$", message: "Invalid email" }] },
        { name: "role",      type: "enum",    required: false, label: "Role",       order: 3,
          options: ["admin", "editor", "viewer"] },
        { name: "isActive",  type: "boolean", required: false, label: "Active",     order: 4 },
        { name: "createdAt", type: "date",    required: false, label: "Created",    order: 5, showInForm: false, readOnly: true },
      ],
    },
    {
      name:  "products",
      label: "Products",
      icon:  "package",
      fields: [
        { name: "name",        type: "string",  required: true,  label: "Product Name", order: 1, colSpan: 2 },
        { name: "sku",         type: "string",  required: false, label: "SKU",          order: 2, colSpan: 1 },
        { name: "price",       type: "number",  required: true,  label: "Price (₹)",    order: 3, colSpan: 1,
          validators: [{ type: "min", value: 0, message: "Price cannot be negative" }] },
        { name: "description", type: "string",  required: false, label: "Description",  order: 4, colSpan: 2 },
        { name: "inStock",     type: "boolean", required: false, label: "In Stock",     order: 5 },
        { name: "createdAt",   type: "date",    required: false, label: "Created",      order: 6, showInForm: false, readOnly: true },
      ],
    },
    {
      name:  "orders",
      label: "Orders",
      icon:  "shopping",
      fields: [
        { name: "orderNo",   type: "string",   required: true,  label: "Order #",    order: 1 },
        { name: "status",    type: "enum",     required: true,  label: "Status",     order: 2,
          options: ["pending", "processing", "shipped", "delivered", "cancelled"] },
        { name: "userId",    type: "relation", required: false, label: "Customer",   order: 3, relation: "users" },
        { name: "products",  type: "relation", required: false, label: "Products",   order: 4,
          relation: "products", multiple: true },
        { name: "total",     type: "number",   required: false, label: "Total (₹)",  order: 5, showInForm: false, readOnly: true },
        { name: "createdAt", type: "date",     required: false, label: "Ordered On", order: 6, showInForm: false, readOnly: true },
      ],
    },
  ];
 
  for (const def of schemaDefs) {
    await SchemaDefinition.findOneAndUpdate(
      { name: def.name },
      def,
      { upsert: true, new: true }
    );
    console.log(`✓ Schema seeded: ${def.name}`);
  }
 
  // ── Seed existing data from your data/ files ──────────────────────
  // Replace these imports with your actual data files:
  // const { users }    = require("../data/users");
  // const { products } = require("../data/products");
  // const { orders }   = require("../data/orders");
  //
  // Example for users:
  // const schemas = await SchemaDefinition.find();
  // for (const schema of schemas) buildDynamicModel(schema);
  // const UserModel = await getDynamicModel("users");
  // await UserModel!.insertMany(users);
  // console.log(`✓ Seeded ${users.length} users`);
 
  console.log("\n✅ Seed complete. You can delete data/ and schema/ folders now.");
  await mongoose.disconnect();
};
 
seed().catch(console.error);