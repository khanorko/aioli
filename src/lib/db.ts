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
      user_id TEXT,
      site_scan_id TEXT,
      unlocked INTEGER DEFAULT 0,
      seo_score INTEGER,
      llm_score INTEGER,
      results TEXT,
      suggestions TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      stripe_customer_id TEXT,
      credits INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_scans (
      id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      user_id TEXT,
      unlocked INTEGER DEFAULT 0,
      total_pages INTEGER DEFAULT 0,
      completed_pages INTEGER DEFAULT 0,
      avg_seo_score INTEGER,
      avg_llm_score INTEGER,
      status TEXT DEFAULT 'processing',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrations for existing tables
  try {
    await db.execute(`ALTER TABLE analyses ADD COLUMN user_id TEXT`);
  } catch {
    // Column already exists
  }
  try {
    await db.execute(`ALTER TABLE analyses ADD COLUMN unlocked INTEGER DEFAULT 0`);
  } catch {
    // Column already exists
  }
  try {
    await db.execute(`ALTER TABLE analyses ADD COLUMN site_scan_id TEXT`);
  } catch {
    // Column already exists
  }
  try {
    await db.execute(`ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0`);
  } catch {
    // Column already exists
  }
}

// Generate a simple unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Analysis CRUD operations
export async function createAnalysis(url: string, userId?: string, siteScanId?: string) {
  const db = getDb();
  const id = generateId();

  await db.execute({
    sql: `INSERT INTO analyses (id, url, user_id, site_scan_id, status) VALUES (?, ?, ?, ?, 'processing')`,
    args: [id, url, userId || null, siteScanId || null],
  });

  return { id, url, userId, siteScanId, status: "processing" };
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
    userId: row.user_id as string | null,
    unlocked: (row.unlocked as number) === 1,
    seoScore: row.seo_score as number | null,
    llmScore: row.llm_score as number | null,
    results: row.results as string | null,
    suggestions: row.suggestions as string | null,
    status: row.status as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function unlockAnalysis(analysisId: string): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `UPDATE analyses SET unlocked = 1 WHERE id = ?`,
    args: [analysisId],
  });
}

export async function getUserAnalyses(userId: string, limit = 50) {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT id, url, seo_score, llm_score, status, created_at
          FROM analyses
          WHERE user_id = ? AND status = 'completed'
          ORDER BY created_at DESC
          LIMIT ?`,
    args: [userId, limit],
  });

  return result.rows.map((row) => ({
    id: row.id as string,
    url: row.url as string,
    seoScore: row.seo_score as number | null,
    llmScore: row.llm_score as number | null,
    status: row.status as string,
    createdAt: new Date(row.created_at as string),
  }));
}

// User types
export interface User {
  id: string;
  email: string;
  stripeCustomerId: string | null;
  credits: number;
  createdAt: Date;
}

// User CRUD operations
export async function createUser(email: string): Promise<User> {
  const db = getDb();
  const id = generateId();
  const now = new Date();

  // New users get 1 free credit
  await db.execute({
    sql: `INSERT INTO users (id, email, credits) VALUES (?, ?, 1)`,
    args: [id, email],
  });

  return {
    id,
    email,
    stripeCustomerId: null,
    credits: 1,
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
    credits?: number;
  }
) {
  const db = getDb();

  const updates: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.stripeCustomerId !== undefined) {
    updates.push("stripe_customer_id = ?");
    args.push(data.stripeCustomerId);
  }
  if (data.credits !== undefined) {
    updates.push("credits = ?");
    args.push(data.credits);
  }

  if (updates.length === 0) return;

  args.push(id);

  await db.execute({
    sql: `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `UPDATE users SET credits = credits + ? WHERE id = ?`,
    args: [amount, userId],
  });
}

export async function consumeCredit(userId: string): Promise<boolean> {
  const db = getDb();
  const user = await getUserById(userId);

  if (!user || user.credits < 1) {
    return false;
  }

  await db.execute({
    sql: `UPDATE users SET credits = credits - 1 WHERE id = ?`,
    args: [userId],
  });

  return true;
}

// Site Scan types
export interface SiteScan {
  id: string;
  domain: string;
  userId: string | null;
  unlocked: boolean;
  totalPages: number;
  completedPages: number;
  avgSeoScore: number | null;
  avgLlmScore: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Site Scan CRUD operations
export async function createSiteScan(domain: string, userId: string, totalPages: number): Promise<SiteScan> {
  const db = getDb();
  const id = generateId();
  const now = new Date();

  await db.execute({
    sql: `INSERT INTO site_scans (id, domain, user_id, total_pages, status) VALUES (?, ?, ?, ?, 'processing')`,
    args: [id, domain, userId, totalPages],
  });

  return {
    id,
    domain,
    userId,
    unlocked: false,
    totalPages,
    completedPages: 0,
    avgSeoScore: null,
    avgLlmScore: null,
    status: "processing",
    createdAt: now,
    updatedAt: now,
  };
}

export async function getSiteScan(id: string): Promise<SiteScan | null> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM site_scans WHERE id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) return null;

  return mapRowToSiteScan(result.rows[0]);
}

export async function updateSiteScan(
  id: string,
  data: {
    completedPages?: number;
    avgSeoScore?: number;
    avgLlmScore?: number;
    status?: string;
    unlocked?: boolean;
  }
): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const args: (string | number)[] = [];

  if (data.completedPages !== undefined) {
    updates.push("completed_pages = ?");
    args.push(data.completedPages);
  }
  if (data.avgSeoScore !== undefined) {
    updates.push("avg_seo_score = ?");
    args.push(data.avgSeoScore);
  }
  if (data.avgLlmScore !== undefined) {
    updates.push("avg_llm_score = ?");
    args.push(data.avgLlmScore);
  }
  if (data.status !== undefined) {
    updates.push("status = ?");
    args.push(data.status);
  }
  if (data.unlocked !== undefined) {
    updates.push("unlocked = ?");
    args.push(data.unlocked ? 1 : 0);
  }

  if (updates.length === 0) return;

  updates.push("updated_at = CURRENT_TIMESTAMP");
  args.push(id);

  await db.execute({
    sql: `UPDATE site_scans SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });
}

export async function getSiteScanAnalyses(siteScanId: string) {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT id, url, seo_score, llm_score, status, created_at
          FROM analyses
          WHERE site_scan_id = ?
          ORDER BY created_at ASC`,
    args: [siteScanId],
  });

  return result.rows.map((row) => ({
    id: row.id as string,
    url: row.url as string,
    seoScore: row.seo_score as number | null,
    llmScore: row.llm_score as number | null,
    status: row.status as string,
    createdAt: new Date(row.created_at as string),
  }));
}

export async function getUserSiteScans(userId: string, limit = 20) {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM site_scans
          WHERE user_id = ? AND status = 'completed'
          ORDER BY created_at DESC
          LIMIT ?`,
    args: [userId, limit],
  });

  return result.rows.map((row) => mapRowToSiteScan(row));
}

function mapRowToSiteScan(row: Record<string, unknown>): SiteScan {
  return {
    id: row.id as string,
    domain: row.domain as string,
    userId: row.user_id as string | null,
    unlocked: (row.unlocked as number) === 1,
    totalPages: (row.total_pages as number) || 0,
    completedPages: (row.completed_pages as number) || 0,
    avgSeoScore: row.avg_seo_score as number | null,
    avgLlmScore: row.avg_llm_score as number | null,
    status: row.status as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

// Admin emails that bypass credit checks
const ADMIN_EMAILS = ["johan.salo@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Helper functions
function mapRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    stripeCustomerId: row.stripe_customer_id as string | null,
    credits: (row.credits as number) || 0,
    createdAt: new Date(row.created_at as string),
  };
}
