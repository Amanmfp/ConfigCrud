const roles = ["admin", "user"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];

const users = Array.from({ length: 150 }, (_, i) => {
  const id = i + 1;

  return {
    id,
    name: `User ${id}`,
    email: `user${id}@test.com`,
    phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,

    password: `pass${id}`, // mock only (never do this in real apps)

    role: roles[id % roles.length],
    isActive: id % 5 !== 0, // some inactive users

    address: `Street ${id}, Area ${id}`,
    city: cities[id % cities.length],
    postalCode: `4000${id % 10}`,
    country: "India",

    avatar: `https://i.pravatar.cc/150?img=${id}`,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

module.exports = { users };