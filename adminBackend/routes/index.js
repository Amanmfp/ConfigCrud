const express = require("express");
const router = express.Router();

const { users } = require("../data/users");
const { products } = require("../data/products");
const { orders } = require("../data/orders");

const userSchema = require("../schema/users");
const productSchema = require("../schema/products");
const orderSchema = require("../schema/orders");

// --- SCHEMA ROUTES ---
router.get("/schema/:model", (req, res) => {
  const { model } = req.params;

  const schemas = {
    users: userSchema,
    products: productSchema,
    orders: orderSchema
  };

  res.json(schemas[model]);
});

// --- LIST ROUTES ---
router.get("/users", (req, res) => res.json(users));
router.get("/products", (req, res) => res.json(products));
router.get("/orders", (req, res) => res.json(orders));

// --- CREATE ROUTES ---
router.post("/users", (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  users.push(newItem);
  res.json(newItem);
});

router.post("/products", (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  products.push(newItem);
  res.json(newItem);
});

router.post("/orders", (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  orders.push(newItem);
  res.json(newItem);
});

// --- UPDATE ---
router.put("/:model/:id", (req, res) => {
  const { model, id } = req.params;

  const dataMap = {
    users,
    products,
    orders,
  };

  const list = dataMap[model];

  if (!list) {
    return res.status(404).json({ error: "Model not found" });
  }

  const index = list.findIndex((item) => item.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  // Update item
  list[index] = {
    ...list[index],
    ...req.body,
    id: list[index].id, // prevent id override
    updatedAt: new Date().toISOString(),
  };

  res.json(list[index]);
});

// --- DELETE ---

router.delete("/:model/:id", (req, res) => {
  const { model, id } = req.params;

  const dataMap = {
    users,
    products,
    orders,
  };

  const list = dataMap[model];

  if (!list) return res.status(404).json({ error: "Model not found" });

  const index = list.findIndex((item) => item.id == id);

  if (index === -1) return res.status(404).json({ error: "Item not found" });

  list.splice(index, 1);

  res.json({ success: true });
});

module.exports = router;