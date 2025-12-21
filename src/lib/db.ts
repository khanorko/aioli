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

// User types
export interface User {
  id: string;
  email: string;
  stripeCustomerId: string | null;
  subscriptionStatus: "free" | "pro" | "canceled";
  subscriptionId: string | null;
  analysesThisMonth: number;
  analysesResetDate: string | null;
  createdAt: Date;
}

// User CRUD operations
export async function createUser(email: string): Promise<User> {
  const db = getDb();
  const id = generateId();
  const now = new Date();
  const resetDate = getNextMonthReset();

  await db.execute({
    sql: `INSERT INTO users (id, email, analyses_reset_date) VALUES (?, ?, ?)`,
    args: [id, email, resetDate],
  });

  return {
    id,
    email,
    stripeCustomerId: null,
    subscriptionStatus: "free",
    subscriptionId: null,
    analysesThisMonth: 0,
    analysesResetDate: resetDate,
    createdAt: now,
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM users WHERE email = ?`,
    args: [email],
  });

  if (result.rows.length === 0) return null;

  return mapRowToUser(result.rows[0]);
}

export async function getUserById(id: string): Promise<User | null> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM users WHERE id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) return null;

  return mapRowToUser(result.rows[0]);
}

export async function getUserByStripeCustomerId(customerId: string): Promise<User | null> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM users WHERE stripe_customer_id = ?`,
    args: [customerId],
  });

  if (result.rows.length === 0) return null;

  return mapRowToUser(result.rows[0]);
}

export async function updateUser(
  id: string,
  data: {
    stripeCustomerId?: string;
    subscriptionStatus?: "free" | "pro" | "canceled";
    subscriptionId?: string | null;
    analysesThisMonth?: number;
    analysesResetDate?: string;
  }
) {
  const db = getDb();

  const updates: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.stripeCustomerId !== undefined) {
    updates.push("stripe_customer_id = ?");
    args.push(data.stripeCustomerId);
  }
  if (data.subscriptionStatus !== undefined) {
    updates.push("subscription_status = ?");
    args.push(data.subscriptionStatus);
  }
  if (data.subscriptionId !== undefined) {
    updates.push("subscription_id = ?");
    args.push(data.subscriptionId);
  }
  if (data.analysesThisMonth !== undefined) {
    updates.push("analyses_this_month = ?");
    args.push(data.analysesThisMonth);
  }
  if (data.analysesResetDate !== undefined) {
    updates.push("analyses_reset_date = ?");
    args.push(data.analysesResetDate);
  }

  if (updates.length === 0) return;

  args.push(id);

  await db.execute({
    sql: `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });
}

export async function incrementAnalysisCount(userId: string): Promise<void> {
  const db = getDb();
  const user = await getUserById(userId);

  if (!user) return;

  // Check if we need to reset the monthly count
  if (user.analysesResetDate && new Date(user.analysesResetDate) <= new Date()) {
    await updateUser(userId, {
      analysesThisMonth: 1,
      analysesResetDate: getNextMonthReset(),
    });
  } else {
    await db.execute({
      sql: `UPDATE users SET analyses_this_month = analyses_this_month + 1 WHERE id = ?`,
      args: [userId],
    });
  }
}

export async function canUserAnalyze(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const user = await getUserById(userId);

  if (!user) {
    return { allowed: false, remaining: 0 };
  }

  // Pro users have unlimited analyses
  if (user.subscriptionStatus === "pro") {
    return { allowed: true, remaining: -1 };
  }

  // Check if we need to reset the monthly count
  let analysesThisMonth = user.analysesThisMonth;
  if (user.analysesResetDate && new Date(user.analysesResetDate) <= new Date()) {
    analysesThisMonth = 0;
  }

  const remaining = Math.max(0, 3 - analysesThisMonth);
  return { allowed: remaining > 0, remaining };
}

// Helper functions
function mapRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    stripeCustomerId: row.stripe_customer_id as string | null,
    subscriptionStatus: (row.subscription_status as "free" | "pro" | "canceled") || "free",
    subscriptionId: row.subscription_id as string | null,
    analysesThisMonth: (row.analyses_this_month as number) || 0,
    analysesResetDate: row.analyses_reset_date as string | null,
    createdAt: new Date(row.created_at as string),
  };
}

function getNextMonthReset(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}
