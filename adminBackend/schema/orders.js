module.exports = {
  model: "orders",
  fields: [
    { name: "id",            type: "number",   required: true },

    // relations
    { name: "userId",        type: "relation", required: true,  relation: "users" },
    { name: "productIds",    type: "relation", required: true,  relation: "products", multiple: true },

    // order details
    { name: "orderNumber",   type: "string",   required: true },
    { name: "status",        type: "string",   required: true }, // pending, confirmed, shipped, delivered, cancelled

    // pricing
    { name: "totalAmount",   type: "number",   required: true },
    { name: "discount",      type: "number",   required: false },
    { name: "tax",           type: "number",   required: false },
    { name: "finalAmount",   type: "number",   required: true },

    // payment
    { name: "paymentMethod", type: "string",   required: true }, // COD, UPI, Card
    { name: "paymentStatus", type: "string",   required: true }, // pending, paid, failed

    // shipping
    { name: "shippingAddress", type: "string", required: true },
    { name: "city",            type: "string", required: true },
    { name: "postalCode",      type: "string", required: true },
    { name: "country",         type: "string", required: true },

    // tracking
    { name: "trackingId",   type: "string",   required: false },

    // timestamps
    { name: "createdAt",    type: "string",   required: false },
    { name: "updatedAt",    type: "string",   required: false },
  ],
};