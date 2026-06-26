/**
 * Direct migration script — creates all tables and enums without interactive prompts.
 * Run via: npm run db:migrate
 */

require("dotenv/config");
const postgres = require("postgres");

const client = postgres(process.env.DATABASE_URL);

async function migrate() {
  console.log("🔄 Running migrations...");

  try {
    // ── Enums ──────────────────────────────────────────────────────────────────
    await client`
      DO $$ BEGIN
        CREATE TYPE role AS ENUM ('EMP', 'RM', 'APE', 'CFO');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    console.log("  ✓ enum: role");

    await client`
      DO $$ BEGIN
        CREATE TYPE reimbursement_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    console.log("  ✓ enum: reimbursement_status");

    // ── app_users ──────────────────────────────────────────────────────────────
    await client`
      CREATE TABLE IF NOT EXISTS app_users (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        TEXT NOT NULL,
        email       TEXT NOT NULL UNIQUE,
        password    TEXT NOT NULL,
        role        role NOT NULL DEFAULT 'EMP',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    console.log("  ✓ table: app_users");

    // ── employee_assignments ──────────────────────────────────────────────────
    await client`
      CREATE TABLE IF NOT EXISTS employee_assignments (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id  UUID NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
        manager_id   UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE
      )
    `;
    console.log("  ✓ table: employee_assignments");

    // ── reimbursements ────────────────────────────────────────────────────────
    await client`
      CREATE TABLE IF NOT EXISTS reimbursements (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title        TEXT NOT NULL,
        description  TEXT NOT NULL,
        amount       DOUBLE PRECISION NOT NULL,
        status       reimbursement_status NOT NULL DEFAULT 'PENDING',
        employee_id  UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
        rm_approved  BOOLEAN NOT NULL DEFAULT FALSE,
        ape_approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    console.log("  ✓ table: reimbursements");

    console.log("\n✅ All migrations applied successfully.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
