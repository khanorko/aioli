// WCAG Types for Aioli

export type WcagLevel = 'A' | 'AA' | 'AAA';
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
  description: string;
  testType: WcagTestType;
  w3cUrl: string;
  version?: '2.1' | '2.2'; // When criterion was added
}

export interface WcagIssue {
  element: string;         // CSS selector or HTML snippet
  description: string;
  severity: IssueSeverity;
  fix: string;
}

export interface WcagTestResult {
  criterion: string;
  status: WcagStatus;
  confidence: number;      // 0.0 - 1.0
  issues: WcagIssue[];
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
  version: '2.1' | '2.2';
  level: WcagLevel;
  pourScores: PourScores;
  summary: WcagAuditSummary;
  results: Record<string, WcagTestResult>;
  createdAt: string;
}
