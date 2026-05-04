let products = [
  {
    id: 1,
    name: "iPhone 15",
    sku: "IPH15-128",
    price: 80000,
    description: "Apple smartphone",
    // categoryId: 1,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "MacBook Pro",
    sku: "MBP-M3",
    price: 180000,
    description: "Apple laptop",
    // categoryId: 2,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
 
module.exports = { products };