const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv/config");

let prisma;

const getPrismaClient = () => {
  if (!prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
};

const connectDB = async () => {
  try {
    const client = getPrismaClient();
    await client.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (prisma) {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected");
  }
};

module.exports = { getPrismaClient, connectDB, disconnectDB };
