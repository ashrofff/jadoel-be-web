const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Admin
  const admin = await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin", 10), // Use a hashed password in production
    },
  });

  console.log("Admin created:", admin);

  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "securepassword", // Use a hashed password in production
        status: 0,
      },
    ],
  });

  console.log(`${users.count} users created.`);

  // Seed Items
  const items = await prisma.item.createMany({
    data: [
      {
        name: "Item 1",
        description: "Description for Item 1",
        price: 10000.0,
        isAvailable: true,
        image: "http://res.cloudinary.com/dlkjeursp/image/upload/v1731935159/jadoel/item/im2eizbfemomkck3ok0e.png",
      },
      {
        name: "Item 2",
        description: "Description for Item 2",
        price: 20000.0,
        isAvailable: false,
        image: "http://res.cloudinary.com/dlkjeursp/image/upload/v1731935159/jadoel/item/im2eizbfemomkck3ok0e.png",
      },
      {
        name: "Item 3",
        description: "Description for Item 3",
        price: 30000.0,
        isAvailable: true,
        image: "http://res.cloudinary.com/dlkjeursp/image/upload/v1731935159/jadoel/item/im2eizbfemomkck3ok0e.png",
      },
    ],
  });

  console.log(`${items.count} items created.`);
}

main()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error while seeding:", e);
    process.exit(1);
  });
