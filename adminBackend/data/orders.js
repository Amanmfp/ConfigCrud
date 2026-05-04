const getRandomProducts = () => {
  const count = Math.floor(Math.random() * 3) + 1; // 1–3 products
  const ids = new Set();

  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * 150) + 1); // assuming 150 products
  }

  return Array.from(ids);
};

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const paymentMethods = ["COD", "UPI", "Card"];
const paymentStatuses = ["pending", "paid", "failed"];

const orders = Array.from({ length: 150 }, (_, i) => {
  const id = i + 1;
  const totalAmount = Math.floor(Math.random() * 5000) + 500;
  const discount = Math.floor(Math.random() * 500);
  const tax = Math.floor(totalAmount * 0.18);
  const finalAmount = totalAmount - discount + tax;

  return {
    id,
    userId: Math.floor(Math.random() * 20) + 1, // assuming 20 users
    productIds: getRandomProducts(),

    orderNumber: `ORD-${String(id).padStart(5, "0")}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],

    totalAmount,
    discount,
    tax,
    finalAmount,

    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],

    shippingAddress: `Street ${id}, Area ${id}`,
    city: "Mumbai",
    postalCode: "4000" + (id % 10),
    country: "India",

    trackingId: `TRK${100000 + id}`,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

module.exports = { orders };