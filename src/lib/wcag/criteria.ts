// WCAG 2.2 Level A + AA Criteria Database
import type { WcagCriterion } from './types';

export const WCAG_CRITERIA: WcagCriterion[] = [
  // ===== PRINCIPLE 1: PERCEIVABLE =====

  // 1.1 Text Alternatives
  {
    id: "1.1.1",
    title: "Non-text Content",
    level: "A",
    principle: "perceivable",
    guideline: "1.1",
    guidelineTitle: "Text Alternatives",
    description: "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
  },

  // 1.2 Time-based Media
  {
    id: "1.2.1",
    title: "Audio-only and Video-only (Prerecorded)",
    level: "A",
    principle: "perceivable",
    guideline: "1.2",
    guidelineTitle: "Time-based Media",
    description: "For prerecorded audio-only and prerecorded video-only media, an alternative is provided.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html"
  },
  {
    id: "1.2.2",
    title: "Captions (Prerecorded)",
    level: "A",
    principle: "perceivable",
    guideline: "1.2",
    guidelineTitle: "Time-based Media",
    description: "Captions are provided for all prerecorded audio content in synchronized media.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html"
  },
  {
    id: "1.2.3",
    title: "Audio Description or Media Alternative (Prerecorded)",
    level: "A",
    principle: "perceivable",
    guideline: "1.2",
    guidelineTitle: "Time-based Media",
    description: "An alternative for time-based media or audio description is provided for prerecorded video content.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html"
  },
  {
    id: "1.2.4",
    title: "Captions (Live)",
    level: "AA",
    principle: "perceivable",
    guideline: "1.2",
    guidelineTitle: "Time-based Media",
    description: "Captions are provided for all live audio content in synchronized media.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html"
  },
  {
    id: "1.2.5",
    title: "Audio Description (Prerecorded)",
    level: "AA",
    principle: "perceivable",
    guideline: "1.2",
    guidelineTitle: "Time-based Media",
    description: "Audio description is provided for all prerecorded video content in synchronized media.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html"
  },

  // 1.3 Adaptable
  {
    id: "1.3.1",
    title: "Info and Relationships",
    level: "A",
    principle: "perceivable",
    guideline: "1.3",
    guidelineTitle: "Adaptable",
    description: "Information, structure, and relationships conveyed through presentation can be programmatically determined.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html"
  },
  {
    id: "1.3.2",
    title: "Meaningful Sequence",
    level: "A",
    principle: "perceivable",
    guideline: "1.3",
    guidelineTitle: "Adaptable",
    description: "When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html"
  },
  {
    id: "1.3.3",
    title: "Sensory Characteristics",
    level: "A",
    principle: "perceivable",
    guideline: "1.3",
    guidelineTitle: "Adaptable",
    description: "Instructions provided for understanding and operating content do not rely solely on sensory characteristics.",
    testType: "ai-assisted",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html"
  },
  {
    id: "1.3.4",
    title: "Orientation",
    level: "AA",
    principle: "perceivable",
    guideline: "1.3",
    guidelineTitle: "Adaptable",
    description: "Content does not restrict its view and operation to a single display orientation.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/orientation.html"
  },
  {
    id: "1.3.5",
    title: "Identify Input Purpose",
    level: "AA",
    principle: "perceivable",
    guideline: "1.3",
    guidelineTitle: "Adaptable",
    description: "The purpose of each input field collecting information about the user can be programmatically determined.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html"
  },

  // 1.4 Distinguishable
  {
    id: "1.4.1",
    title: "Use of Color",
    level: "A",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "Color is not used as the only visual means of conveying information.",
    testType: "ai-assisted",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
  },
  {
    id: "1.4.2",
    title: "Audio Control",
    level: "A",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "If audio plays automatically for more than 3 seconds, a mechanism is available to pause or control it.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html"
  },
  {
    id: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "Text has a contrast ratio of at least 4.5:1 (3:1 for large text).",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
  },
  {
    id: "1.4.4",
    title: "Resize Text",
    level: "AA",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "Text can be resized up to 200% without loss of content or functionality.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html"
  },
  {
    id: "1.4.5",
    title: "Images of Text",
    level: "AA",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "If technologies can achieve the visual presentation, text is used rather than images of text.",
    testType: "ai-assisted",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html"
  },
  {
    id: "1.4.10",
    title: "Reflow",
    level: "AA",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "Content can be presented without horizontal scrolling at 320 CSS pixels width.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  },
  {
    id: "1.4.11",
    title: "Non-text Contrast",
    level: "AA",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "UI components and graphical objects have a contrast ratio of at least 3:1.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
  },
  {
    id: "1.4.12",
    title: "Text Spacing",
    level: "AA",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "No loss of content when text spacing is modified.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html"
  },
  {
    id: "1.4.13",
    title: "Content on Hover or Focus",
    level: "AA",
    principle: "perceivable",
    guideline: "1.4",
    guidelineTitle: "Distinguishable",
    description: "Additional content that appears on hover or focus is dismissible, hoverable, and persistent.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"
  },

  // ===== PRINCIPLE 2: OPERABLE =====

  // 2.1 Keyboard Accessible
  {
    id: "2.1.1",
    title: "Keyboard",
    level: "A",
    principle: "operable",
    guideline: "2.1",
    guidelineTitle: "Keyboard Accessible",
    description: "All functionality is available from a keyboard.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html"
  },
  {
    id: "2.1.2",
    title: "No Keyboard Trap",
    level: "A",
    principle: "operable",
    guideline: "2.1",
    guidelineTitle: "Keyboard Accessible",
    description: "Keyboard focus can be moved away from any component using only a keyboard.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html"
  },
  {
    id: "2.1.4",
    title: "Character Key Shortcuts",
    level: "A",
    principle: "operable",
    guideline: "2.1",
    guidelineTitle: "Keyboard Accessible",
    description: "Single character key shortcuts can be turned off, remapped, or are only active on focus.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html"
  },

  // 2.2 Enough Time
  {
    id: "2.2.1",
    title: "Timing Adjustable",
    level: "A",
    principle: "operable",
    guideline: "2.2",
    guidelineTitle: "Enough Time",
    description: "Time limits can be turned off, adjusted, or extended.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html"
  },
  {
    id: "2.2.2",
    title: "Pause, Stop, Hide",
    level: "A",
    principle: "operable",
    guideline: "2.2",
    guidelineTitle: "Enough Time",
    description: "Moving, blinking, or auto-updating content can be paused, stopped, or hidden.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
  },

  // 2.3 Seizures and Physical Reactions
  {
    id: "2.3.1",
    title: "Three Flashes or Below Threshold",
    level: "A",
    principle: "operable",
    guideline: "2.3",
    guidelineTitle: "Seizures and Physical Reactions",
    description: "Pages do not contain anything that flashes more than three times per second.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html"
  },

  // 2.4 Navigable
  {
    id: "2.4.1",
    title: "Bypass Blocks",
    level: "A",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "A mechanism is available to bypass blocks of content that are repeated on multiple pages.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html"
  },
  {
    id: "2.4.2",
    title: "Page Titled",
    level: "A",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "Pages have titles that describe topic or purpose.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html"
  },
  {
    id: "2.4.3",
    title: "Focus Order",
    level: "A",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "Components receive focus in an order that preserves meaning and operability.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
  },
  {
    id: "2.4.4",
    title: "Link Purpose (In Context)",
    level: "A",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "The purpose of each link can be determined from the link text alone or with context.",
    testType: "ai-assisted",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html"
  },
  {
    id: "2.4.5",
    title: "Multiple Ways",
    level: "AA",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "More than one way is available to locate a page within a set of pages.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html"
  },
  {
    id: "2.4.6",
    title: "Headings and Labels",
    level: "AA",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "Headings and labels describe topic or purpose.",
    testType: "ai-assisted",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html"
  },
  {
    id: "2.4.7",
    title: "Focus Visible",
    level: "AA",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "Any keyboard operable user interface has a visible focus indicator.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
  },
  {
    id: "2.4.11",
    title: "Focus Not Obscured (Minimum)",
    level: "AA",
    principle: "operable",
    guideline: "2.4",
    guidelineTitle: "Navigable",
    description: "When a component receives keyboard focus, it is not entirely hidden by author-created content.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
    version: "2.2"
  },

  // 2.5 Input Modalities
  {
    id: "2.5.1",
    title: "Pointer Gestures",
    level: "A",
    principle: "operable",
    guideline: "2.5",
    guidelineTitle: "Input Modalities",
    description: "Functionality using multipoint or path-based gestures can be operated with single pointer.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html"
  },
  {
    id: "2.5.2",
    title: "Pointer Cancellation",
    level: "A",
    principle: "operable",
    guideline: "2.5",
    guidelineTitle: "Input Modalities",
    description: "Functions triggered by single pointer can be cancelled.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html"
  },
  {
    id: "2.5.3",
    title: "Label in Name",
    level: "A",
    principle: "operable",
    guideline: "2.5",
    guidelineTitle: "Input Modalities",
    description: "Components with visible text labels have the name that contains the visible text.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html"
  },
  {
    id: "2.5.4",
    title: "Motion Actuation",
    level: "A",
    principle: "operable",
    guideline: "2.5",
    guidelineTitle: "Input Modalities",
    description: "Functions operated by device motion can also be operated by user interface components.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html"
  },
  {
    id: "2.5.7",
    title: "Dragging Movements",
    level: "AA",
    principle: "operable",
    guideline: "2.5",
    guidelineTitle: "Input Modalities",
    description: "Functionality that uses dragging can be achieved with a single pointer without dragging.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
    version: "2.2"
  },
  {
    id: "2.5.8",
    title: "Target Size (Minimum)",
    level: "AA",
    principle: "operable",
    guideline: "2.5",
    guidelineTitle: "Input Modalities",
    description: "Targets are at least 24 by 24 CSS pixels.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
    version: "2.2"
  },

  // ===== PRINCIPLE 3: UNDERSTANDABLE =====

  // 3.1 Readable
  {
    id: "3.1.1",
    title: "Language of Page",
    level: "A",
    principle: "understandable",
    guideline: "3.1",
    guidelineTitle: "Readable",
    description: "The default human language of each page can be programmatically determined.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html"
  },
  {
    id: "3.1.2",
    title: "Language of Parts",
    level: "AA",
    principle: "understandable",
    guideline: "3.1",
    guidelineTitle: "Readable",
    description: "The human language of each passage or phrase can be programmatically determined.",
    testType: "ai-assisted",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html"
  },

  // 3.2 Predictable
  {
    id: "3.2.1",
    title: "On Focus",
    level: "A",
    principle: "understandable",
    guideline: "3.2",
    guidelineTitle: "Predictable",
    description: "Receiving focus does not initiate a change of context.",
    testType: "browser-required",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html"
  },
  {
    id: "3.2.2",
    title: "On Input",
    level: "A",
    principle: "understandable",
    guideline: "3.2",
    guidelineTitle: "Predictable",
    description: "Changing a setting does not automatically cause a change of context unless user is advised.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html"
  },
  {
    id: "3.2.3",
    title: "Consistent Navigation",
    level: "AA",
    principle: "understandable",
    guideline: "3.2",
    guidelineTitle: "Predictable",
    description: "Navigation mechanisms occur in the same relative order on each page.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html"
  },
  {
    id: "3.2.4",
    title: "Consistent Identification",
    level: "AA",
    principle: "understandable",
    guideline: "3.2",
    guidelineTitle: "Predictable",
    description: "Components with the same functionality are identified consistently.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html"
  },
  {
    id: "3.2.6",
    title: "Consistent Help",
    level: "A",
    principle: "understandable",
    guideline: "3.2",
    guidelineTitle: "Predictable",
    description: "Help mechanisms occur in the same relative order on each page.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html",
    version: "2.2"
  },

  // 3.3 Input Assistance
  {
    id: "3.3.1",
    title: "Error Identification",
    level: "A",
    principle: "understandable",
    guideline: "3.3",
    guidelineTitle: "Input Assistance",
    description: "Input errors are automatically detected and described to the user in text.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html"
  },
  {
    id: "3.3.2",
    title: "Labels or Instructions",
    level: "A",
    principle: "understandable",
    guideline: "3.3",
    guidelineTitle: "Input Assistance",
    description: "Labels or instructions are provided when content requires user input.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
  },
  {
    id: "3.3.3",
    title: "Error Suggestion",
    level: "AA",
    principle: "understandable",
    guideline: "3.3",
    guidelineTitle: "Input Assistance",
    description: "If an error is detected and suggestions are known, they are provided to the user.",
    testType: "ai-assisted",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html"
  },
  {
    id: "3.3.4",
    title: "Error Prevention (Legal, Financial, Data)",
    level: "AA",
    principle: "understandable",
    guideline: "3.3",
    guidelineTitle: "Input Assistance",
    description: "Submissions that cause legal or financial commitments can be reversed, checked, or confirmed.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html"
  },
  {
    id: "3.3.7",
    title: "Redundant Entry",
    level: "A",
    principle: "understandable",
    guideline: "3.3",
    guidelineTitle: "Input Assistance",
    description: "Information previously entered is auto-populated or available for the user to select.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html",
    version: "2.2"
  },
  {
    id: "3.3.8",
    title: "Accessible Authentication (Minimum)",
    level: "AA",
    principle: "understandable",
    guideline: "3.3",
    guidelineTitle: "Input Assistance",
    description: "Authentication processes do not require cognitive function tests unless an alternative is provided.",
    testType: "manual",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html",
    version: "2.2"
  },

  // ===== PRINCIPLE 4: ROBUST =====

  // 4.1 Compatible
  {
    id: "4.1.2",
    title: "Name, Role, Value",
    level: "A",
    principle: "robust",
    guideline: "4.1",
    guidelineTitle: "Compatible",
    description: "For all UI components, the name and role can be programmatically determined.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
  },
  {
    id: "4.1.3",
    title: "Status Messages",
    level: "AA",
    principle: "robust",
    guideline: "4.1",
    guidelineTitle: "Compatible",
    description: "Status messages can be programmatically determined through role or properties.",
    testType: "automated",
    w3cUrl: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  }
];

// Helper functions
export function getCriteriaByLevel(level: 'A' | 'AA' | 'AAA'): WcagCriterion[] {
  if (level === 'A') return WCAG_CRITERIA.filter(c => c.level === 'A');
  if (level === 'AA') return WCAG_CRITERIA.filter(c => ['A', 'AA'].includes(c.level));
  return WCAG_CRITERIA;
}

export function getCriteriaByPrinciple(principle: string): WcagCriterion[] {
  return WCAG_CRITERIA.filter(c => c.principle === principle);
}

export function getCriterionById(id: string): WcagCriterion | undefined {
  return WCAG_CRITERIA.find(c => c.id === id);
}

export function getAutomatedCriteria(): WcagCriterion[] {
  return WCAG_CRITERIA.filter(c => c.testType === 'automated' || c.testType === 'ai-assisted');
}
