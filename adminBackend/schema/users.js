module.exports = {
  model: "users",
  fields: [
    { name: "id",        type: "number",  required: true },

    // basic info
    { name: "name",      type: "string",  required: true },
    { name: "email",     type: "string",  required: true },
    { name: "phone",     type: "string",  required: false },

    // auth (basic level)
    { name: "password",  type: "string",  required: true },

    // role & status
    { name: "role",      type: "string",  required: true }, // admin, user
    { name: "isActive",  type: "boolean", required: false },

    // address (useful for orders)
    { name: "address",   type: "string",  required: false },
    { name: "city",      type: "string",  required: false },
    { name: "postalCode",type: "string",  required: false },
    { name: "country",   type: "string",  required: false },

    // profile
    { name: "avatar",    type: "string",  required: false },

    // timestamps
    { name: "createdAt", type: "string",  required: false },
    { name: "updatedAt", type: "string",  required: false },
  ],
};