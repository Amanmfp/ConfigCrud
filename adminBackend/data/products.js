const products = Array.from({ length: 150 }, (_, i) => {
  const id = i + 1;

  return {
    id,
    name: `Product ${id}`,
    sku: `SKU-${String(id).padStart(4, "0")}`,
    price: 500 + id * 100, // just to vary price
    description: `Description for Product ${id}`,
    inStock: id % 3 !== 0, // some false values
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

module.exports = { products };