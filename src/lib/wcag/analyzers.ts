// WCAG Automated Analyzers
import type { ScrapedPage } from '../scraper';
import type { WcagTestResult, WcagIssue } from './types';
import type { Element } from 'domhandler';

type Analyzer = (page: ScrapedPage) => WcagTestResult;

// Helper to safely get tag name from cheerio element
function getTagName(el: unknown): string {
  if (el && typeof el === 'object' && 'tagName' in el) {
    return ((el as Element).tagName || 'element').toLowerCase();
  }
  return 'element';
}

// Helper to create test result
function createResult(
  criterion: string,
  status: WcagTestResult['status'],
  issues: WcagIssue[] = [],
  observations?: string
): WcagTestResult {
  return {
    criterion,
    status,
    confidence: issues.length === 0 ? 0.95 : 0.85,
    issues,
    observations,
    testedAt: new Date().toISOString()
  };
}

// ===== 1.1.1 Non-text Content =====
export function analyze_1_1_1(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check images without alt
  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    const src = $(el).attr('src') || 'unknown';

    if (alt === undefined) {
      issues.push({
        element: `<img src="${src.slice(0, 50)}...">`,
        description: "Image missing alt attribute",
        severity: "serious",
        fix: "Add alt='description' for informative images, or alt='' for decorative images"
      });
    }
  });

  // Check SVGs without accessibility
  $('svg').each((_, el) => {
    const hasAriaHidden = $(el).attr('aria-hidden') === 'true';
    const hasAriaLabel = $(el).attr('aria-label');
    const hasTitle = $(el).find('title').length > 0;
    const hasRole = $(el).attr('role');

    if (!hasAriaHidden && !hasAriaLabel && !hasTitle) {
      issues.push({
        element: "<svg> (inline)",
        description: "SVG lacks accessibility attributes",
        severity: "moderate",
        fix: "Add aria-hidden='true' for decorative SVGs, or aria-label for meaningful ones"
      });
    }
  });

  // Check input type="image"
  $('input[type="image"]').each((_, el) => {
    if (!$(el).attr('alt')) {
      issues.push({
        element: '<input type="image">',
        description: "Image input missing alt attribute",
        severity: "serious",
        fix: "Add alt attribute describing the button action"
      });
    }
  });

  return createResult("1.1.1", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 1.3.1 Info and Relationships =====
export function analyze_1_3_1(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check form inputs without labels
  $('input, select, textarea').each((_, el) => {
    const type = $(el).attr('type');
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') return;

    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledby = $(el).attr('aria-labelledby');
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    const isWrappedByLabel = $(el).closest('label').length > 0;

    if (!hasLabel && !ariaLabel && !ariaLabelledby && !isWrappedByLabel) {
      issues.push({
        element: `<${getTagName(el)} type="${type || 'text'}">`,
        description: "Form input lacks associated label",
        severity: "serious",
        fix: "Add <label for='inputId'>, or aria-label, or wrap input in <label>"
      });
    }
  });

  // Check tables for proper headers
  $('table').each((_, el) => {
    const hasHeaders = $(el).find('th').length > 0;
    const hasCaption = $(el).find('caption').length > 0;

    if (!hasHeaders && !$(el).attr('role')) {
      issues.push({
        element: "<table>",
        description: "Table lacks header cells",
        severity: "moderate",
        fix: "Use <th> for header cells, or add role='presentation' for layout tables"
      });
    }
  });

  return createResult("1.3.1", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 1.3.2 Meaningful Sequence =====
export function analyze_1_3_2(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for CSS order that might disrupt reading
  // Note: Full check requires computed styles (browser-required)
  // We can only check for obvious issues in inline styles

  $('[style*="order"]').each((_, el) => {
    issues.push({
      element: $(el).prop('tagName')?.toLowerCase() || 'element',
      description: "Element uses CSS order property which may disrupt reading sequence",
      severity: "moderate",
      fix: "Ensure visual order matches DOM order, or use aria-flowto"
    });
  });

  return createResult("1.3.2", issues.length === 0 ? 'passed' : 'failed', issues,
    "DOM order appears to match visual order. Full verification requires browser testing.");
}

// ===== 1.3.5 Identify Input Purpose =====
export function analyze_1_3_5(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Personal data input types that should have autocomplete
  const personalInputTypes = [
    { pattern: /name/i, autocomplete: 'name' },
    { pattern: /email/i, autocomplete: 'email' },
    { pattern: /phone|tel/i, autocomplete: 'tel' },
    { pattern: /address/i, autocomplete: 'street-address' },
    { pattern: /city/i, autocomplete: 'address-level2' },
    { pattern: /zip|postal/i, autocomplete: 'postal-code' },
    { pattern: /country/i, autocomplete: 'country' },
    { pattern: /password/i, autocomplete: 'current-password' }
  ];

  $('input').each((_, el) => {
    const name = $(el).attr('name') || '';
    const id = $(el).attr('id') || '';
    const type = $(el).attr('type') || 'text';
    const autocomplete = $(el).attr('autocomplete');
    const placeholder = $(el).attr('placeholder') || '';

    const combined = `${name} ${id} ${placeholder}`.toLowerCase();

    for (const { pattern, autocomplete: expectedAc } of personalInputTypes) {
      if (pattern.test(combined) && !autocomplete) {
        issues.push({
          element: `<input name="${name}" type="${type}">`,
          description: `Input appears to collect ${pattern.source} but lacks autocomplete attribute`,
          severity: "moderate",
          fix: `Add autocomplete="${expectedAc}"`
        });
        break;
      }
    }
  });

  return createResult("1.3.5", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 1.4.2 Audio Control =====
export function analyze_1_4_2(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for autoplay audio/video
  $('audio[autoplay], video[autoplay]').each((_, el) => {
    const hasControls = $(el).attr('controls') !== undefined;
    const isMuted = $(el).attr('muted') !== undefined;

    if (!hasControls && !isMuted) {
      issues.push({
        element: `<${getTagName(el)} autoplay>`,
        description: "Auto-playing media without controls or muted",
        severity: "serious",
        fix: "Add controls attribute, or muted attribute, or remove autoplay"
      });
    }
  });

  return createResult("1.4.2", issues.length === 0 ? 'passed' : 'failed', issues,
    issues.length === 0 ? "No auto-playing audio detected" : undefined);
}

// ===== 2.1.4 Character Key Shortcuts =====
export function analyze_2_1_4(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for accesskey attributes (potential single-character shortcuts)
  $('[accesskey]').each((_, el) => {
    const key = $(el).attr('accesskey');
    if (key && key.length === 1) {
      issues.push({
        element: `<${getTagName(el)} accesskey="${key}">`,
        description: "Single character accesskey detected",
        severity: "moderate",
        fix: "Ensure shortcut can be turned off or remapped, or is only active on focus"
      });
    }
  });

  return createResult("2.1.4", issues.length === 0 ? 'passed' : 'not-applicable', issues,
    "No single-character keyboard shortcuts detected in HTML");
}

// ===== 2.2.2 Pause, Stop, Hide =====
export function analyze_2_2_2(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for auto-updating content indicators
  const autoRefresh = $('meta[http-equiv="refresh"]');
  if (autoRefresh.length > 0) {
    issues.push({
      element: '<meta http-equiv="refresh">',
      description: "Page uses automatic refresh",
      severity: "serious",
      fix: "Remove auto-refresh or provide user control"
    });
  }

  // Check for marquee (deprecated but still used)
  if ($('marquee').length > 0) {
    issues.push({
      element: '<marquee>',
      description: "Moving marquee content without pause control",
      severity: "serious",
      fix: "Remove marquee or provide pause mechanism"
    });
  }

  return createResult("2.2.2", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 2.4.1 Bypass Blocks =====
export function analyze_2_4_1(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for skip links
  const skipLink = $('a[href="#main"], a[href="#content"], a[href="#maincontent"]');
  const hasSkipLink = skipLink.length > 0;

  // Check for landmark roles
  const hasMainLandmark = $('main, [role="main"]').length > 0;
  const hasNavLandmark = $('nav, [role="navigation"]').length > 0;

  if (!hasSkipLink && !hasMainLandmark) {
    issues.push({
      element: "Document",
      description: "No skip link or main landmark found",
      severity: "serious",
      fix: "Add <a href='#main'>Skip to main content</a> before navigation, and id='main' to main content"
    });
  }

  return createResult("2.4.1", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 2.4.2 Page Titled =====
export function analyze_2_4_2(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  const title = $('title').text().trim();

  if (!title) {
    issues.push({
      element: "<title>",
      description: "Page has no title",
      severity: "critical",
      fix: "Add a descriptive <title> element in <head>"
    });
  } else if (title.length < 10) {
    issues.push({
      element: `<title>${title}</title>`,
      description: "Page title may be too short to be descriptive",
      severity: "moderate",
      fix: "Use a more descriptive title that identifies the page content"
    });
  }

  return createResult("2.4.2", issues.length === 0 ? 'passed' : 'failed', issues,
    title ? `Title: "${title}"` : undefined);
}

// ===== 2.5.3 Label in Name =====
export function analyze_2_5_3(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check buttons with aria-label that differs from visible text
  $('button, [role="button"]').each((_, el) => {
    const ariaLabel = $(el).attr('aria-label');
    const visibleText = $(el).text().trim();

    if (ariaLabel && visibleText && !ariaLabel.toLowerCase().includes(visibleText.toLowerCase())) {
      issues.push({
        element: `<button aria-label="${ariaLabel}">${visibleText}</button>`,
        description: "Accessible name doesn't include visible text",
        severity: "serious",
        fix: `Ensure aria-label includes the visible text "${visibleText}"`
      });
    }
  });

  return createResult("2.5.3", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 3.1.1 Language of Page =====
export function analyze_3_1_1(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  const htmlLang = $('html').attr('lang');

  if (!htmlLang) {
    issues.push({
      element: "<html>",
      description: "Page language not specified",
      severity: "serious",
      fix: "Add lang attribute to <html> element, e.g., <html lang='en'>"
    });
  } else if (htmlLang.length < 2) {
    issues.push({
      element: `<html lang="${htmlLang}">`,
      description: "Invalid language code",
      severity: "serious",
      fix: "Use a valid BCP 47 language tag, e.g., 'en', 'sv', 'en-US'"
    });
  }

  return createResult("3.1.1", issues.length === 0 ? 'passed' : 'failed', issues,
    htmlLang ? `Language: ${htmlLang}` : undefined);
}

// ===== 3.2.2 On Input =====
export function analyze_3_2_2(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for select elements that might auto-submit
  $('select').each((_, el) => {
    const hasOnChange = $(el).attr('onchange');
    if (hasOnChange && hasOnChange.includes('submit')) {
      issues.push({
        element: '<select onchange="...submit...">',
        description: "Select element appears to auto-submit on change",
        severity: "serious",
        fix: "Add explicit submit button, or warn users before auto-submit"
      });
    }
  });

  return createResult("3.2.2", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 3.3.1 Error Identification =====
export function analyze_3_3_1(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for aria-invalid without error message
  $('[aria-invalid="true"]').each((_, el) => {
    const hasErrorMessage = $(el).attr('aria-describedby') || $(el).attr('aria-errormessage');
    if (!hasErrorMessage) {
      issues.push({
        element: `<${getTagName(el)} aria-invalid="true">`,
        description: "Invalid input lacks error message reference",
        severity: "moderate",
        fix: "Add aria-describedby or aria-errormessage pointing to error text"
      });
    }
  });

  return createResult("3.3.1", issues.length === 0 ? 'passed' : 'failed', issues,
    "Error identification patterns checked");
}

// ===== 3.3.2 Labels or Instructions =====
export function analyze_3_3_2(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check inputs that need labels
  $('input, select, textarea').each((_, el) => {
    const type = $(el).attr('type');
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') return;

    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledby = $(el).attr('aria-labelledby');
    const placeholder = $(el).attr('placeholder');
    const hasLabel = id && $(`label[for="${id}"]`).length > 0;
    const isWrappedByLabel = $(el).closest('label').length > 0;

    // Placeholder alone is not sufficient
    if (!hasLabel && !ariaLabel && !ariaLabelledby && !isWrappedByLabel) {
      issues.push({
        element: `<${getTagName(el)}${placeholder ? ` placeholder="${placeholder}"` : ''}>`,
        description: placeholder
          ? "Input uses placeholder instead of label (placeholder is not a label replacement)"
          : "Input lacks label or instructions",
        severity: "serious",
        fix: "Add visible <label> element, or aria-label attribute"
      });
    }
  });

  return createResult("3.3.2", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 4.1.2 Name, Role, Value =====
export function analyze_4_1_2(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check custom controls
  $('[onclick], [onkeypress]').each((_, el) => {
    const tagName = getTagName(el);
    const role = $(el).attr('role');

    // Non-interactive elements with click handlers need role
    if (!['a', 'button', 'input', 'select', 'textarea'].includes(tagName) && !role) {
      issues.push({
        element: `<${tagName} onclick="...">`,
        description: "Clickable element lacks role attribute",
        severity: "serious",
        fix: "Add appropriate role (e.g., role='button') and ensure keyboard accessibility"
      });
    }
  });

  // Check for empty buttons
  $('button, [role="button"]').each((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label');
    const title = $(el).attr('title');

    if (!text && !ariaLabel && !title) {
      issues.push({
        element: '<button> (empty)',
        description: "Button has no accessible name",
        severity: "critical",
        fix: "Add text content, aria-label, or title to the button"
      });
    }
  });

  return createResult("4.1.2", issues.length === 0 ? 'passed' : 'failed', issues);
}

// ===== 4.1.3 Status Messages =====
export function analyze_4_1_3(page: ScrapedPage): WcagTestResult {
  const { $ } = page;
  const issues: WcagIssue[] = [];

  // Check for status/alert regions
  const hasLiveRegion = $('[role="status"], [role="alert"], [aria-live]').length > 0;

  // This is informational - can't fully test without JavaScript execution
  return createResult("4.1.3", 'needs-manual', issues,
    hasLiveRegion
      ? "Live regions detected. Verify status messages are announced by screen readers."
      : "No live regions detected. If status messages exist, add aria-live or role='status'.");
}

// Map of criterion ID to analyzer function
export const analyzers: Record<string, Analyzer> = {
  "1.1.1": analyze_1_1_1,
  "1.3.1": analyze_1_3_1,
  "1.3.2": analyze_1_3_2,
  "1.3.5": analyze_1_3_5,
  "1.4.2": analyze_1_4_2,
  "2.1.4": analyze_2_1_4,
  "2.2.2": analyze_2_2_2,
  "2.4.1": analyze_2_4_1,
  "2.4.2": analyze_2_4_2,
  "2.5.3": analyze_2_5_3,
  "3.1.1": analyze_3_1_1,
  "3.2.2": analyze_3_2_2,
  "3.3.1": analyze_3_3_1,
  "3.3.2": analyze_3_3_2,
  "4.1.2": analyze_4_1_2,
  "4.1.3": analyze_4_1_3,
};

// Check if an analyzer exists for a criterion
export function hasAnalyzer(criterionId: string): boolean {
  return criterionId in analyzers;
}

// Run analyzer for a specific criterion
export function runAnalyzer(criterionId: string, page: ScrapedPage): WcagTestResult {
  const analyzer = analyzers[criterionId];

  if (analyzer) {
    return analyzer(page);
  }

  // Return needs-manual for criteria without automated analyzers
  return {
    criterion: criterionId,
    status: 'needs-manual',
    confidence: 0.5,
    issues: [],
    observations: "This criterion requires manual testing or browser automation.",
    testedAt: new Date().toISOString()
  };
}
