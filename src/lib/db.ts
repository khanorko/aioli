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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS brand_checks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      brand_name TEXT NOT NULL,
      website TEXT,
      industry TEXT,
      overall_score INTEGER DEFAULT 0,
      status TEXT DEFAULT 'unknown',
      ai_response TEXT,
      recommendations TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
const ADMIN_EMAILS = [
  "johan.salo@gmail.com",
  "johan.salo@aiempowerlabs.com",
  "johan.salo.ai@gmail.com"
];

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

// ==================
// QUIZ FUNCTIONALITY
// ==================

export interface QuizAttempt {
  id: string;
  userId: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  isPerfect: boolean;
  timeTakenSeconds: number;
  createdAt: Date;
}

export interface QuizReward {
  earnedQuizCredit: boolean;
  earnedShareCredit: boolean;
}

// Initialize quiz tables
export async function initQuizTables() {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_email TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      is_perfect INTEGER NOT NULL DEFAULT 0,
      time_taken_seconds INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add quiz reward tracking columns to users table
  try {
    await db.execute(`ALTER TABLE users ADD COLUMN quiz_credit_earned INTEGER DEFAULT 0`);
  } catch {
    // Column already exists
  }
  try {
    await db.execute(`ALTER TABLE users ADD COLUMN share_credit_earned INTEGER DEFAULT 0`);
  } catch {
    // Column already exists
  }
}

// Record a quiz attempt and award credit if perfect (first time only)
export async function recordQuizAttempt(
  userId: string,
  userEmail: string,
  score: number,
  totalQuestions: number,
  timeTakenSeconds: number
): Promise<{ creditAwarded: boolean; attemptId: string }> {
  const db = getDb();
  const id = generateId();
  const isPerfect = score === totalQuestions;

  await db.execute({
    sql: `INSERT INTO quiz_attempts (id, user_id, user_email, score, total_questions, is_perfect, time_taken_seconds)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, userId, userEmail, score, totalQuestions, isPerfect ? 1 : 0, timeTakenSeconds],
  });

  // Check if user has already earned quiz credit
  const userResult = await db.execute({
    sql: `SELECT quiz_credit_earned FROM users WHERE id = ?`,
    args: [userId],
  });

  let creditAwarded = false;
  if (isPerfect && userResult.rows.length > 0) {
    const hasEarnedCredit = (userResult.rows[0].quiz_credit_earned as number) === 1;
    if (!hasEarnedCredit) {
      // Award credit and mark as earned
      await db.execute({
        sql: `UPDATE users SET credits = credits + 1, quiz_credit_earned = 1 WHERE id = ?`,
        args: [userId],
      });
      creditAwarded = true;
    }
  }

  return { creditAwarded, attemptId: id };
}

// Record share and award credit (first time only)
export async function recordQuizShare(userId: string): Promise<boolean> {
  const db = getDb();

  // Check if user has already earned share credit
  const userResult = await db.execute({
    sql: `SELECT share_credit_earned FROM users WHERE id = ?`,
    args: [userId],
  });

  if (userResult.rows.length === 0) return false;

  const hasEarnedCredit = (userResult.rows[0].share_credit_earned as number) === 1;
  if (hasEarnedCredit) return false;

  // Award credit and mark as earned
  await db.execute({
    sql: `UPDATE users SET credits = credits + 1, share_credit_earned = 1 WHERE id = ?`,
    args: [userId],
  });

  return true;
}

// Get user's quiz reward status
export async function getUserQuizRewards(userId: string): Promise<QuizReward> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT quiz_credit_earned, share_credit_earned FROM users WHERE id = ?`,
    args: [userId],
  });

  if (result.rows.length === 0) {
    return { earnedQuizCredit: false, earnedShareCredit: false };
  }

  return {
    earnedQuizCredit: (result.rows[0].quiz_credit_earned as number) === 1,
    earnedShareCredit: (result.rows[0].share_credit_earned as number) === 1,
  };
}

// Get quiz leaderboard (top scores with best times)
export async function getQuizLeaderboard(limit = 10): Promise<QuizAttempt[]> {
  const db = getDb();

  // Get best attempt per user (highest score, then fastest time)
  const result = await db.execute({
    sql: `
      SELECT q.*
      FROM quiz_attempts q
      INNER JOIN (
        SELECT user_id, MAX(score) as max_score, MIN(time_taken_seconds) as min_time
        FROM quiz_attempts
        GROUP BY user_id
      ) best ON q.user_id = best.user_id AND q.score = best.max_score
      WHERE q.time_taken_seconds = (
        SELECT MIN(time_taken_seconds)
        FROM quiz_attempts
        WHERE user_id = q.user_id AND score = q.score
      )
      ORDER BY q.score DESC, q.time_taken_seconds ASC
      LIMIT ?
    `,
    args: [limit],
  });

  return result.rows.map((row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    userEmail: row.user_email as string,
    score: row.score as number,
    totalQuestions: row.total_questions as number,
    isPerfect: (row.is_perfect as number) === 1,
    timeTakenSeconds: row.time_taken_seconds as number,
    createdAt: new Date(row.created_at as string),
  }));
}

// Get user's best quiz attempt
export async function getUserBestQuizAttempt(userId: string): Promise<QuizAttempt | null> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM quiz_attempts
          WHERE user_id = ?
          ORDER BY score DESC, time_taken_seconds ASC
          LIMIT 1`,
    args: [userId],
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userEmail: row.user_email as string,
    score: row.score as number,
    totalQuestions: row.total_questions as number,
    isPerfect: (row.is_perfect as number) === 1,
    timeTakenSeconds: row.time_taken_seconds as number,
    createdAt: new Date(row.created_at as string),
  };
}

// =====================
// BRAND CHECK FUNCTIONALITY
// =====================

export interface BrandCheck {
  id: string;
  userId: string;
  brandName: string;
  website: string | null;
  industry: string | null;
  overallScore: number;
  status: 'known' | 'partial' | 'unknown' | 'confused';
  aiResponse: string;
  recommendations: string; // JSON array
  createdAt: Date;
}

// Initialize brand checks table
export async function initBrandCheckTable() {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS brand_checks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      brand_name TEXT NOT NULL,
      website TEXT,
      industry TEXT,
      overall_score INTEGER DEFAULT 0,
      status TEXT DEFAULT 'unknown',
      ai_response TEXT,
      recommendations TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Create a brand check
export async function createBrandCheck(
  userId: string,
  brandName: string,
  website?: string,
  industry?: string
): Promise<BrandCheck> {
  const db = getDb();
  const id = generateId();
  const now = new Date();

  await db.execute({
    sql: `INSERT INTO brand_checks (id, user_id, brand_name, website, industry) VALUES (?, ?, ?, ?, ?)`,
    args: [id, userId, brandName, website || null, industry || null],
  });

  return {
    id,
    userId,
    brandName,
    website: website || null,
    industry: industry || null,
    overallScore: 0,
    status: 'unknown',
    aiResponse: '',
    recommendations: '[]',
    createdAt: now,
  };
}

// Update brand check with results
export async function updateBrandCheck(
  id: string,
  data: {
    overallScore?: number;
    status?: 'known' | 'partial' | 'unknown' | 'confused';
    aiResponse?: string;
    recommendations?: string;
  }
): Promise<void> {
  const db = getDb();

  const updates: string[] = [];
  const args: (string | number)[] = [];

  if (data.overallScore !== undefined) {
    updates.push("overall_score = ?");
    args.push(data.overallScore);
  }
  if (data.status !== undefined) {
    updates.push("status = ?");
    args.push(data.status);
  }
  if (data.aiResponse !== undefined) {
    updates.push("ai_response = ?");
    args.push(data.aiResponse);
  }
  if (data.recommendations !== undefined) {
    updates.push("recommendations = ?");
    args.push(data.recommendations);
  }

  if (updates.length === 0) return;

  args.push(id);

  await db.execute({
    sql: `UPDATE brand_checks SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });
}

// Get brand check by ID
export async function getBrandCheck(id: string): Promise<BrandCheck | null> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM brand_checks WHERE id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) return null;

  return mapRowToBrandCheck(result.rows[0]);
}

// Get user's brand checks
export async function getUserBrandChecks(userId: string, limit = 20): Promise<BrandCheck[]> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT * FROM brand_checks
          WHERE user_id = ?
          ORDER BY created_at DESC
          LIMIT ?`,
    args: [userId, limit],
  });

  return result.rows.map((row) => mapRowToBrandCheck(row));
}

function mapRowToBrandCheck(row: Record<string, unknown>): BrandCheck {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    brandName: row.brand_name as string,
    website: row.website as string | null,
    industry: row.industry as string | null,
    overallScore: (row.overall_score as number) || 0,
    status: (row.status as 'known' | 'partial' | 'unknown' | 'confused') || 'unknown',
    aiResponse: (row.ai_response as string) || '',
    recommendations: (row.recommendations as string) || '[]',
    createdAt: new Date(row.created_at as string),
  };
}
