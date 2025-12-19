import { createClient, Client } from "@libsql/client";

let client: Client | null = null;

export function getDb(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }

  client = createClient({
    url,
    authToken,
  });

  return client;
}

// Initialize database schema
export async function initDb() {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      seo_score INTEGER,
      llm_score INTEGER,
      results TEXT,
      suggestions TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Generate a simple unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Analysis CRUD operations
export async function createAnalysis(url: string) {
  const db = getDb();
  const id = generateId();

  await db.execute({
    sql: `INSERT INTO analyses (id, url, status) VALUES (?, ?, 'processing')`,
    args: [id, url],
  });

  return { id, url, status: "processing" };
}

export async function updateAnalysis(
  id: string,
  data: {
    seoScore?: number;
    llmScore?: number;
    results?: string;
    suggestions?: string;
    status?: string;
  }
) {
  const db = getDb();

  const updates: string[] = [];
  const args: (string | number)[] = [];

  if (data.seoScore !== undefined) {
    updates.push("seo_score = ?");
    args.push(data.seoScore);
  }
  if (data.llmScore !== undefined) {
    updates.push("llm_score = ?");
    args.push(data.llmScore);
  }
  if (data.results !== undefined) {
    updates.push("results = ?");
    args.push(data.results);
  }
  if (data.suggestions !== undefined) {
    updates.push("suggestions = ?");
    args.push(data.suggestions);
  }
  if (data.status !== undefined) {
    updates.push("status = ?");
    args.push(data.status);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  args.push(id);

  await db.execute({
    sql: `UPDATE analyses SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });
}

export async function getAnalysis(id: string) {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM analyses WHERE id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    url: row.url as string,
    seoScore: row.seo_score as number | null,
    llmScore: row.llm_score as number | null,
    results: row.results as string | null,
    suggestions: row.suggestions as string | null,
    status: row.status as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}
