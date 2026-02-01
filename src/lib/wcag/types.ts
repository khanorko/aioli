// WCAG Types for Aioli

export type WcagLevel = 'A' | 'AA' | 'AAA';
export type WcagVersion = '2.1' | '2.2';
export type WcagPrinciple = 'perceivable' | 'operable' | 'understandable' | 'robust';
export type WcagTestType = 'automated' | 'ai-assisted' | 'browser-required' | 'manual';
export type WcagStatus = 'passed' | 'failed' | 'not-applicable' | 'not-checked' | 'needs-browser' | 'needs-manual';
export type IssueSeverity = 'critical' | 'serious' | 'moderate' | 'minor';

export interface WcagCriterion {
  id: string;              // "1.4.3"
  title: string;           // "Contrast (Minimum)"
  level: WcagLevel;
  principle: WcagPrinciple;
  guideline: string;       // "1.4"
  guidelineTitle: string;  // "Distinguishable"
  description: string;     // Short description
  fullText?: string;       // Full W3C requirement text
  exceptions?: string[];   // List of exceptions (for criteria that have them)
  testType: WcagTestType;
  w3cUrl: string;
  version?: WcagVersion;   // When criterion was added (undefined = both)
}

export interface WcagIssue {
  element: string;         // CSS selector or HTML snippet
  description: string;
  severity: IssueSeverity;
  fix: string;
}

export interface TestedElement {
  type: string;            // "images" | "forms" | "headings" | "links" etc.
  count: number;           // How many elements were tested
  passed: number;          // How many passed
  details?: string[];      // Specific findings or element identifiers
}

export interface WcagTestResult {
  criterion: string;
  status: WcagStatus;
  confidence: number;      // 0.0 - 1.0
  issues: WcagIssue[];
  testedElements?: TestedElement[];  // What was tested
  observations?: string;
  testedAt: string;
}

export interface PourScores {
  perceivable: number;     // 0-100
  operable: number;
  understandable: number;
  robust: number;
  overall: number;
}

export interface WcagAuditSummary {
  total: number;
  passed: number;
  failed: number;
  needsBrowser: number;
  needsManual: number;
  notApplicable: number;
}

export interface WcagAuditResult {
  id: string;
  url: string;
  version: WcagVersion;
  level: WcagLevel;
  pourScores: PourScores;
  summary: WcagAuditSummary;
  results: Record<string, WcagTestResult>;
  createdAt: string;
}
