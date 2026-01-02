// AI Visibility Quiz Question Pool
// 20 questions from the learn articles

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // From "What is AI Visibility?"
  {
    id: "q1",
    question: "What is AI visibility?",
    options: [
      "How visible your AI chatbot is on your website",
      "How well your content can be discovered and cited by AI assistants",
      "How many AI tools you use for SEO",
      "Your website's ranking in AI-powered search engines",
    ],
    correctIndex: 1,
    explanation:
      "AI visibility measures how well your website content can be discovered, understood, and cited by AI assistants like ChatGPT, Claude, and Perplexity.",
  },
  {
    id: "q2",
    question: "How many people use ChatGPT weekly as mentioned in the article?",
    options: [
      "Over 50 million",
      "Over 100 million",
      "Over 200 million",
      "Over 500 million",
    ],
    correctIndex: 1,
    explanation:
      "In 2024, over 100 million people use ChatGPT weekly, making AI visibility crucial for content discoverability.",
  },
  {
    id: "q3",
    question: "What are the 4 pillars of AI visibility?",
    options: [
      "Speed, Design, Keywords, Links",
      "Content, Backlinks, Social Media, Ads",
      "Structured Data, Content Clarity, Citability, E-E-A-T Signals",
      "SEO, SEM, SMM, Email Marketing",
    ],
    correctIndex: 2,
    explanation:
      "The 4 pillars are: Structured Data (Schema.org), Content Clarity, Citability, and E-E-A-T Signals.",
  },
  {
    id: "q4",
    question: "Pages with proper Schema.org markup are how much more likely to be cited by AI?",
    options: ["2x more likely", "3x more likely", "5x more likely", "10x more likely"],
    correctIndex: 1,
    explanation:
      "Pages with proper Schema.org markup are 3x more likely to be cited by AI assistants.",
  },
  {
    id: "q5",
    question: "What does E-E-A-T stand for?",
    options: [
      "Experience, Expertise, Authoritativeness, Trustworthiness",
      "Engagement, Experience, Authority, Traffic",
      "Expertise, Efficiency, Accuracy, Technology",
      "Experience, Engagement, Analytics, Testing",
    ],
    correctIndex: 0,
    explanation:
      "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness - key signals for both Google and AI systems.",
  },
  {
    id: "q6",
    question: "In traditional SEO, keywords are very important. In AI visibility, keywords are:",
    options: [
      "Even more important",
      "Equally important",
      "Less important",
      "Not used at all",
    ],
    correctIndex: 2,
    explanation:
      "Keywords are less important for AI visibility because AI understands natural language and context, not just keyword matches.",
  },
  {
    id: "q7",
    question: "For AI visibility, what matters more than content length?",
    options: ["Keyword density", "Backlinks", "Clarity", "Word count"],
    correctIndex: 2,
    explanation:
      "For AI visibility, clarity matters more than length. AI assistants extract information best from clear, well-structured content.",
  },

  // From "How to Optimize for ChatGPT"
  {
    id: "q8",
    question: "What is the single most important factor for AI visibility according to the guide?",
    options: [
      "Backlinks",
      "Schema.org structured data",
      "Social media presence",
      "Page speed",
    ],
    correctIndex: 1,
    explanation:
      "Schema.org structured data is the single most important factor for AI visibility as it tells AI systems exactly what your content is about.",
  },
  {
    id: "q9",
    question: "Which Schema.org type should you use for FAQ sections?",
    options: ["Article", "HowTo", "FAQPage", "WebPage"],
    correctIndex: 2,
    explanation:
      "FAQPage is the Schema.org type specifically designed for FAQ content with question-answer format.",
  },
  {
    id: "q10",
    question: "Why do AI assistants love FAQ content?",
    options: [
      "It loads faster",
      "It has more keywords",
      "It's already in question-answer format",
      "It has more backlinks",
    ],
    correctIndex: 2,
    explanation:
      "AI assistants love FAQ content because it's already in question-answer format - exactly how users interact with them.",
  },
  {
    id: "q11",
    question: "Which statement is CITABLE for AI assistants?",
    options: [
      '"Our product is really fast"',
      '"We help many businesses"',
      '"Our product reduces page load time by 47%"',
      '"Customers love our service"',
    ],
    correctIndex: 2,
    explanation:
      "Specific statistics and data are citable. 'Reduces page load time by 47%' contains a specific, verifiable fact.",
  },
  {
    id: "q12",
    question: "What should you include to demonstrate expertise (E-E-A-T)?",
    options: [
      "More images",
      "Longer content",
      "Author bylines with credentials and publication dates",
      "More internal links",
    ],
    correctIndex: 2,
    explanation:
      "To demonstrate E-E-A-T, add author bylines with credentials, publication dates, and 'last updated' dates.",
  },
  {
    id: "q13",
    question: "Which AI crawlers should you allow in robots.txt?",
    options: [
      "GoogleBot only",
      "GPTBot and ClaudeBot",
      "BingBot only",
      "No AI crawlers",
    ],
    correctIndex: 1,
    explanation:
      "You should allow GPTBot (OpenAI) and ClaudeBot (Anthropic) in your robots.txt to ensure AI assistants can access your content.",
  },

  // From "AI SEO vs Traditional SEO"
  {
    id: "q14",
    question: "What is the primary goal of traditional SEO?",
    options: [
      "Be cited by AI assistants",
      "Rank in search results",
      "Get social media shares",
      "Increase page speed",
    ],
    correctIndex: 1,
    explanation:
      "Traditional SEO's primary goal is to rank higher in search engine results pages (SERPs).",
  },
  {
    id: "q15",
    question: "What is the primary goal of AI SEO (AI visibility optimization)?",
    options: [
      "Rank in search results",
      "Get more backlinks",
      "Be cited by AI assistants",
      "Increase keyword density",
    ],
    correctIndex: 2,
    explanation:
      "AI SEO's primary goal is to be cited and referenced when users ask AI assistants questions about your topic.",
  },
  {
    id: "q16",
    question: "For traditional SEO, Schema.org is 'nice to have'. For AI SEO, it is:",
    options: ["Optional", "Not needed", "Essential", "Harmful"],
    correctIndex: 2,
    explanation:
      "While Schema.org is 'nice to have' for traditional SEO, it's absolutely essential for AI visibility.",
  },
  {
    id: "q17",
    question: "Backlinks are critical for traditional SEO. For AI SEO, they are:",
    options: [
      "Even more critical",
      "Equally critical",
      "Helpful but not critical",
      "Not used at all",
    ],
    correctIndex: 2,
    explanation:
      "AI assistants don't weight backlinks the same way as Google - they evaluate content quality directly.",
  },
  {
    id: "q18",
    question: "What should smart marketers do regarding traditional SEO and AI visibility?",
    options: [
      "Focus only on traditional SEO",
      "Focus only on AI visibility",
      "Do both",
      "Wait to see which becomes more important",
    ],
    correctIndex: 2,
    explanation:
      "Smart marketers don't choose between traditional SEO and AI visibility - they do both for maximum digital presence.",
  },
  {
    id: "q19",
    question: "What type of content structure helps BOTH traditional SEO and AI visibility?",
    options: [
      "Long paragraphs",
      "Clear headings and organization",
      "Keyword stuffing",
      "Hidden text",
    ],
    correctIndex: 1,
    explanation:
      "Clear structure with proper headings and logical organization helps both search engines and AI systems understand your content.",
  },
  {
    id: "q20",
    question: "Which metric is specific to AI visibility (not traditional SEO)?",
    options: [
      "Organic traffic",
      "Click-through rate",
      "AI visibility score and citations",
      "Bounce rate",
    ],
    correctIndex: 2,
    explanation:
      "AI visibility score and AI citations are specific metrics for measuring how well AI assistants understand and reference your content.",
  },
];

// Get random questions from the pool
export function getRandomQuestions(count: number = 5): QuizQuestion[] {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const QUESTIONS_PER_QUIZ = 5;
export const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
