module.exports = {
  model: "orders",
  fields: [
    { name: "userId", type: "relation", relation: "users" },
    { name: "productIds", type: "relation", relation: "products", multiple: true }
  ]
};