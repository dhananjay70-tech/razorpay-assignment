/**
 * Seed Script — seeds the root CFO account.
 * Run via: npm run db:seed-data
 * DO NOT add any other seed data — only the CFO root account.
 */

require("dotenv/config");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CFO_EMAIL = "cfo@org.com";
const CFO_PASSWORD = "CFO#ORG@April2026";
const CFO_NAME = "CFO";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: CFO_EMAIL } });

  if (existing) {
    console.log("✅ CFO account already exists — skipping seed.");
    return;
  }

  const hashed = await bcrypt.hash(CFO_PASSWORD, 10);

  await prisma.user.create({
    data: {
      name: CFO_NAME,
      email: CFO_EMAIL,
      password: hashed,
      role: "CFO",
    },
  });

  console.log("✅ CFO account seeded successfully.");
  console.log(`   email: ${CFO_EMAIL}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
