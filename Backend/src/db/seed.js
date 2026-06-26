/**
 * Seed Script — seeds the root CFO account.
 * Run via: npm run db:seed-data
 * DO NOT add any other seed data — only the CFO root account.
 */

require("dotenv/config");
const bcrypt     = require("bcrypt");
const postgresJs = require("postgres");
const { drizzle } = require("drizzle-orm/postgres-js");
const { eq }     = require("drizzle-orm");
const schema      = require("./schema");
const { appUsers }  = schema;

const CFO_EMAIL    = "cfo@org.com";
const CFO_PASSWORD = "CFO#ORG@April2026";
const CFO_NAME     = "CFO";

async function main() {
  const client = postgresJs(process.env.DATABASE_URL);
  const db     = drizzle(client, { schema });

  try {
    const [existing] = await db
      .select()
      .from(appUsers)
      .where(eq(appUsers.email, CFO_EMAIL))
      .limit(1);

    if (existing) {
      console.log("✅ CFO account already exists — skipping seed.");
      return;
    }

    const hashed = await bcrypt.hash(CFO_PASSWORD, 10);

    await db.insert(appUsers).values({
      name:     CFO_NAME,
      email:    CFO_EMAIL,
      password: hashed,
      role:     "CFO",
    });

    console.log("✅ CFO account seeded successfully.");
    console.log(`   email: ${CFO_EMAIL}`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
