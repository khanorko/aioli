// WCAG 2.1/2.2 Level A + AA Criteria Database
import type { WcagCriterion, WcagLevel, WcagVersion } from './types';

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
    fullText: "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for the situations listed below.",
    exceptions: [
      "Controls, Input: If non-text content is a control or accepts user input, then it has a name that describes its purpose.",
      "Time-Based Media: If non-text content is time-based media, then text alternatives at least provide descriptive identification of the non-text content.",
      "Test: If non-text content is a test or exercise that would be invalid if presented in text, then text alternatives at least provide descriptive identification of the non-text content.",
      "Sensory: If non-text content is primarily intended to create a specific sensory experience, then text alternatives at least provide descriptive identification of the non-text content.",
      "CAPTCHA: If the purpose of non-text content is to confirm that content is being accessed by a person rather than a computer, then text alternatives that identify and describe the purpose of the non-text content are provided.",
      "Decoration, Formatting, Invisible: If non-text content is pure decoration, is used only for visual formatting, or is not presented to users, then it is implemented in a way that it can be ignored by assistive technology."
    ],
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
    fullText: "For prerecorded audio-only and prerecorded video-only media, the following are true, except when the audio or video is a media alternative for text and is clearly labeled as such:",
    exceptions: [
      "Prerecorded Audio-only: An alternative for time-based media is provided that presents equivalent information for prerecorded audio-only content.",
      "Prerecorded Video-only: Either an alternative for time-based media or an audio track is provided that presents equivalent information for prerecorded video-only content."
    ],
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
    fullText: "Captions are provided for all prerecorded audio content in synchronized media, except when the media is a media alternative for text and is clearly labeled as such.",
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
    fullText: "An alternative for time-based media or audio description of the prerecorded video content is provided for synchronized media, except when the media is a media alternative for text and is clearly labeled as such.",
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
    fullText: "Captions are provided for all live audio content in synchronized media.",
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
    fullText: "Audio description is provided for all prerecorded video content in synchronized media.",
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
    fullText: "Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.",
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
    fullText: "When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined.",
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
    fullText: "Instructions provided for understanding and operating content do not rely solely on sensory characteristics of components such as shape, size, visual location, orientation, or sound.",
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
    fullText: "Content does not restrict its view and operation to a single display orientation, such as portrait or landscape, unless a specific display orientation is essential.",
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
    fullText: "The purpose of each input field collecting information about the user can be programmatically determined when: The input field serves a purpose identified in the Input Purposes for User Interface Components section; and The content is implemented using technologies with support for identifying the expected meaning for form input data.",
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
    fullText: "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.",
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
    fullText: "If any audio on a Web page plays automatically for more than 3 seconds, either a mechanism is available to pause or stop the audio, or a mechanism is available to control audio volume independently from the overall system volume level.",
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
    fullText: "The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following:",
    exceptions: [
      "Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1.",
      "Incidental: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.",
      "Logotypes: Text that is part of a logo or brand name has no contrast requirement."
    ],
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
    fullText: "Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality.",
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
    fullText: "If the technologies being used can achieve the visual presentation, text is used to convey information rather than images of text except for the following:",
    exceptions: [
      "Customizable: The image of text can be visually customized to the user's requirements.",
      "Essential: A particular presentation of text is essential to the information being conveyed."
    ],
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
    fullText: "Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for: Vertical scrolling content at a width equivalent to 320 CSS pixels; Horizontal scrolling content at a height equivalent to 256 CSS pixels. Except for parts of the content which require two-dimensional layout for usage or meaning.",
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
    fullText: "The visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s): User Interface Components: Visual information required to identify user interface components and states, except for inactive components or where the appearance of the component is determined by the user agent and not modified by the author; Graphical Objects: Parts of graphics required to understand the content, except when a particular presentation of graphics is essential to the information being conveyed.",
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
    fullText: "In content implemented using markup languages that support the following text style properties, no loss of content or functionality occurs by setting all of the following and by changing no other style property: Line height (line spacing) to at least 1.5 times the font size; Spacing following paragraphs to at least 2 times the font size; Letter spacing (tracking) to at least 0.12 times the font size; Word spacing to at least 0.16 times the font size. Exception: Human languages and scripts that do not make use of one or more of these text style properties in written text can conform using only the properties that exist for that combination of language and script.",
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
    fullText: "Where receiving and then removing pointer hover or keyboard focus triggers additional content to become visible and then hidden, the following are true:",
    exceptions: [
      "Dismissible: A mechanism is available to dismiss the additional content without moving pointer hover or keyboard focus, unless the additional content communicates an input error or does not obscure or replace other content.",
      "Hoverable: If pointer hover can trigger the additional content, then the pointer can be moved over the additional content without the additional content disappearing.",
      "Persistent: The additional content remains visible until the hover or focus trigger is removed, the user dismisses it, or its information is no longer valid."
    ],
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
    fullText: "All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes, except where the underlying function requires input that depends on the path of the user's movement and not just the endpoints.",
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
    fullText: "If keyboard focus can be moved to a component of the page using a keyboard interface, then focus can be moved away from that component using only a keyboard interface, and, if it requires more than unmodified arrow or tab keys or other standard exit methods, the user is advised of the method for moving focus away.",
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
    fullText: "If a keyboard shortcut is implemented in content using only letter (including upper- and lower-case letters), punctuation, number, or symbol characters, then at least one of the following is true:",
    exceptions: [
      "Turn off: A mechanism is available to turn the shortcut off.",
      "Remap: A mechanism is available to remap the shortcut to include one or more non-printable keyboard keys (e.g., Ctrl, Alt).",
      "Active only on focus: The keyboard shortcut for a user interface component is only active when that component has focus."
    ],
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
    fullText: "For each time limit that is set by the content, at least one of the following is true:",
    exceptions: [
      "Turn off: The user is allowed to turn off the time limit before encountering it.",
      "Adjust: The user is allowed to adjust the time limit before encountering it over a wide range that is at least ten times the length of the default setting.",
      "Extend: The user is warned before time expires and given at least 20 seconds to extend the time limit with a simple action, and the user is allowed to extend the time limit at least ten times.",
      "Real-time Exception: The time limit is a required part of a real-time event, and no alternative to the time limit is possible.",
      "Essential Exception: The time limit is essential and extending it would invalidate the activity.",
      "20 Hour Exception: The time limit is longer than 20 hours."
    ],
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
    fullText: "For moving, blinking, scrolling, or auto-updating information, all of the following are true:",
    exceptions: [
      "Moving, blinking, scrolling: For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it unless the movement, blinking, or scrolling is part of an activity where it is essential.",
      "Auto-updating: For any auto-updating information that (1) starts automatically and (2) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it or to control the frequency of the update unless the auto-updating is part of an activity where it is essential."
    ],
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
    fullText: "Web pages do not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds.",
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
    fullText: "A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.",
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
    fullText: "Web pages have titles that describe topic or purpose.",
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
    fullText: "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.",
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
    fullText: "The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined link context, except where the purpose of the link would be ambiguous to users in general.",
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
    fullText: "More than one way is available to locate a Web page within a set of Web pages except where the Web Page is the result of, or a step in, a process.",
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
    fullText: "Headings and labels describe topic or purpose.",
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
    fullText: "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.",
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
    fullText: "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content.",
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
    fullText: "All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture, unless a multipoint or path-based gesture is essential.",
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
    fullText: "For functionality that can be operated using a single pointer, at least one of the following is true:",
    exceptions: [
      "No Down-Event: The down-event of the pointer is not used to execute any part of the function.",
      "Abort or Undo: Completion of the function is on the up-event, and a mechanism is available to abort the function before completion or to undo the function after completion.",
      "Up Reversal: The up-event reverses any outcome of the preceding down-event.",
      "Essential: Completing the function on the down-event is essential."
    ],
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
    fullText: "For user interface components with labels that include text or images of text, the name contains the text that is presented visually.",
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
    fullText: "Functionality that can be operated by device motion or user motion can also be operated by user interface components and responding to the motion can be disabled to prevent accidental actuation, except when: The motion is used to operate functionality through an accessibility supported interface; The motion is essential for the function and doing so would invalidate the activity.",
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
    fullText: "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential or the functionality is determined by the user agent and not modified by the author.",
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
    fullText: "The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where: Spacing: Undersized targets are positioned so that if a 24 CSS pixel diameter circle is centered on the bounding box of each, the circles do not intersect another target or the circle for another undersized target; Equivalent: The function can be achieved through a different control on the same page that meets this criterion; Inline: The target is in a sentence or its size is otherwise constrained by the line-height of non-target text; User agent control: The size of the target is determined by the user agent and is not modified by the author; Essential: A particular presentation of the target is essential or is legally required for the information being conveyed.",
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
    fullText: "The default human language of each Web page can be programmatically determined.",
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
    fullText: "The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text.",
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
    fullText: "When any user interface component receives focus, it does not initiate a change of context.",
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
    fullText: "Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior before using the component.",
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
    fullText: "Navigational mechanisms that are repeated on multiple Web pages within a set of Web pages occur in the same relative order each time they are repeated, unless a change is initiated by the user.",
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
    fullText: "Components that have the same functionality within a set of Web pages are identified consistently.",
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
    fullText: "If a Web page contains any of the following help mechanisms, and those mechanisms are repeated on multiple Web pages within a set of Web pages, they occur in the same order relative to other page content, unless a change is initiated by the user: Human contact details; Human contact mechanism; Self-help option; A fully automated contact mechanism.",
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
    fullText: "If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.",
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
    fullText: "Labels or instructions are provided when content requires user input.",
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
    fullText: "If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user, unless it would jeopardize the security or purpose of the content.",
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
    fullText: "For Web pages that cause legal commitments or financial transactions for the user to occur, that modify or delete user-controllable data in data storage systems, or that submit user test responses, at least one of the following is true:",
    exceptions: [
      "Reversible: Submissions are reversible.",
      "Checked: Data entered by the user is checked for input errors and the user is provided an opportunity to correct them.",
      "Confirmed: A mechanism is available for reviewing, confirming, and correcting information before finalizing the submission."
    ],
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
    fullText: "Information previously entered by or provided to the user that is required to be entered again in the same process is either: auto-populated, or available for the user to select. Except when: re-entering the information is essential, or the information is required to ensure the security of the content, or previously entered information is no longer valid.",
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
    fullText: "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides at least one of the following: Alternative (another authentication method that does not rely on a cognitive function test); Mechanism (a mechanism is available to assist the user in completing the cognitive function test); Object Recognition (the cognitive function test is to recognize objects); Personal Content (the cognitive function test is to identify non-text content the user provided to the Web site).",
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
    fullText: "For all user interface components (including but not limited to: form elements, links and components generated by scripts), the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set; and notification of changes to these items is available to user agents, including assistive technologies.",
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
    fullText: "In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus.",
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

// Version-aware filtering
export function getCriteriaByVersion(version: WcagVersion): WcagCriterion[] {
  if (version === "2.1") {
    // Exclude criteria that are new in 2.2
    return WCAG_CRITERIA.filter(c => c.version !== "2.2");
  }
  // 2.2 includes all criteria
  return WCAG_CRITERIA;
}

export function getCriteriaByLevelAndVersion(
  level: WcagLevel,
  version: WcagVersion
): WcagCriterion[] {
  const versionFiltered = getCriteriaByVersion(version);
  if (level === 'A') return versionFiltered.filter(c => c.level === 'A');
  if (level === 'AA') return versionFiltered.filter(c => ['A', 'AA'].includes(c.level));
  return versionFiltered; // AAA = all
}
