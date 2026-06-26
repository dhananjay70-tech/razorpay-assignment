/**
 * Drizzle ORM database client — replaces src/config/db.js (Prisma version).
 * Exports: getDb(), connectDB(), disconnectDB()
 */

const { drizzle } = require("drizzle-orm/postgres-js");
const postgresJs  = require("postgres");
const schema      = require("../db/schema");
require("dotenv/config");

let db;
let client;

const getDb = () => {
  if (!db) {
    client = postgresJs(process.env.DATABASE_URL);
    db = drizzle(client, { schema });
  }
  return db;
};

const connectDB = async () => {
  try {
    getDb();
    // Run a lightweight query to validate the connection
    await db.execute("SELECT 1");
    console.log("✅ Database connected successfully (Drizzle)");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (client) {
    await client.end();
    console.log("🔌 Database disconnected");
  }
};

module.exports = { getDb, connectDB, disconnectDB };
