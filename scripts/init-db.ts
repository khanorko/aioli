import { createClient } from "@libsql/client";

async function initDatabase() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  console.log("Creating analyses table...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      user_id TEXT,
      seo_score INTEGER,
      llm_score INTEGER,
      results TEXT,
      suggestions TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Creating users table...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      stripe_customer_id TEXT,
      subscription_status TEXT DEFAULT 'free',
      subscription_id TEXT,
      analyses_this_month INTEGER DEFAULT 0,
      analyses_reset_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database initialized successfully!");
  process.exit(0);
}

initDatabase().catch((error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});
