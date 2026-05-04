module.exports = {
  model: "products",
  fields: [
    { name: "id",          type: "number",   required: true                          },
    { name: "name",        type: "string",   required: true                          },
    { name: "sku",         type: "string",   required: true                          },
    { name: "price",       type: "number",   required: true                          },
    { name: "description", type: "string",   required: false                         },
    // { name: "categoryId",  type: "relation", required: false, relation: "categories" },
    { name: "inStock",     type: "boolean",  required: false                         },
    { name: "createdAt",   type: "string",   required: false                         },
    { name: "updatedAt",   type: "string",   required: false                         },
  ],
};