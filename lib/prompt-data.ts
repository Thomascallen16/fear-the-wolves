export type PromptCategory =
  | "Research"
  | "Records"
  | "Communication"
  | "Context"
  | "Art & Design"
  | "Trades"
  | "Judicial Review"
  | "Education"
  | "Everyday";

export type PromptField = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  optional?: boolean;
};

export type PromptTemplate = {
  id: string;
  title: string;
  category: PromptCategory;
  summary: string;
  prompt: string;
  fields: PromptField[];
  safetyNote?: string;
  accent: string;
};

export const promptCategories: Array<"All" | PromptCategory> = [
  "All",
  "Research",
  "Records",
  "Communication",
  "Context",
  "Art & Design",
  "Trades",
  "Judicial Review",
  "Education",
  "Everyday",
];

export const promptTemplates: PromptTemplate[] = [
  {
    id: "claim-audit",
    title: "Claim audit",
    category: "Research",
    summary: "Test a statement against source material without blurring fact and inference.",
    accent: "#3F7F69",
    fields: [
      { key: "claim", label: "Claim to test", placeholder: "The claim you want to verify" },
      { key: "source", label: "Source material", placeholder: "Paste an official excerpt with page labels", multiline: true },
    ],
    prompt:
      "Audit this claim against the source material below: \"{{claim}}\"\n\nReturn only one of: Supported; Partially supported; Contradicted; Not established. Then provide the exact supporting or conflicting quotation, its page or section, the narrowest defensible interpretation, and the missing record or fact that would resolve uncertainty.\n\nSource material: \"\"\"{{source}}\"\"\"",
  },
  {
    id: "records-map",
    title: "Records map",
    category: "Records",
    summary: "Identify likely custodians, record types, portals, and next searches.",
    accent: "#146C94",
    fields: [
      { key: "topic", label: "Research topic", placeholder: "What public activity or decision are you researching?" },
      { key: "jurisdiction", label: "Jurisdiction", placeholder: "City, county, state, federal agency, or country" },
      { key: "range", label: "Date range", placeholder: "Example: January 2024 to present" },
    ],
    prompt:
      "I am researching {{topic}} in {{jurisdiction}} from {{range}}. Build a records-custodian map. For each likely public body, list: why it may hold records, official portal or office to check, likely record types, exact search terms, and the next step if no published record is found. Separate published-record sources from formal request channels. Do not suggest accessing non-public systems or sensitive personal information.",
  },
  {
    id: "search-matrix",
    title: "Official search matrix",
    category: "Records",
    summary: "Build precise official-domain searches before spending time in broad web results.",
    accent: "#146C94",
    fields: [
      { key: "topic", label: "Topic or project", placeholder: "Project, decision, case, or program" },
      { key: "agency", label: "Agency or domain", placeholder: "Example: cityname.gov" },
      { key: "range", label: "Date range", placeholder: "Example: after:2024-01-01 before:2025-01-01" },
    ],
    prompt:
      "Create a search matrix for finding already-published official records about {{topic}} on {{agency}}. Use only documented Google operators: site:, exact quotes, filetype:, after:, before:, and -. Include a table with purpose, query, why it may work, and which official portal to check if Google finds nothing. Apply this date range where useful: {{range}}. Treat search results as discovery leads, not a complete record inventory.",
  },
  {
    id: "carry-forward",
    title: "Carry-forward brief",
    category: "Context",
    summary: "Preserve only the research state you need for the next ChatGPT session.",
    accent: "#F3A75A",
    fields: [
      { key: "material", label: "Current notes or chat output", placeholder: "Paste the useful research state", multiline: true },
    ],
    prompt:
      "Create a carry-forward brief for a new research chat. Include: objective; active question; source IDs and pages used; verified facts; direct quotes worth preserving; unresolved questions; rejected or contradicted claims; constraints; and the next highest-value action. Keep it under 350 words. Do not add information that was not established.\n\nMaterial: \"\"\"{{material}}\"\"\"",
  },
  {
    id: "source-index",
    title: "Source index",
    category: "Context",
    summary: "Turn a mixed bundle of notes into concise, retrievable source entries.",
    accent: "#F3A75A",
    fields: [
      { key: "sources", label: "Titles, links, or excerpts", placeholder: "Paste source details", multiline: true },
    ],
    prompt:
      "Create a source index for the material below. For each item assign a Source ID and identify issuer, date, record type, page range if known, main subject, key relevance, and missing attachments or metadata. Do not interpret beyond what is stated. Return a compact table.\n\nMaterial: \"\"\"{{sources}}\"\"\"",
  },
  {
    id: "clear-message",
    title: "Clear a rough message",
    category: "Communication",
    summary: "Turn rough notes into a direct, respectful message that asks for one clear action.",
    accent: "#10233E",
    fields: [
      { key: "audience", label: "Audience", placeholder: "Who is receiving this?" },
      { key: "tone", label: "Tone", placeholder: "Example: direct, calm, and professional" },
      { key: "notes", label: "Rough notes", placeholder: "Paste what you need to say", multiline: true },
    ],
    prompt:
      "Turn these rough notes into a clear message for {{audience}}. Start with the purpose, state the relevant facts, make the request or decision explicit, and end with the next step. Keep the tone {{tone}}. Do not add facts that are not in my notes.\n\nNotes: \"\"\"{{notes}}\"\"\"",
  },
  {
    id: "firm-kind",
    title: "Firm, not hostile",
    category: "Communication",
    summary: "Hold a boundary without sounding accusatory, vague, or defensive.",
    accent: "#10233E",
    fields: [{ key: "message", label: "Message draft", placeholder: "Paste the draft", multiline: true }],
    prompt:
      "Rewrite this message so it is firm, specific, and difficult to misinterpret without becoming hostile or defensive. Preserve the core boundary, request, and factual claims. Remove sarcasm, accusations, and vague threats. Give me one concise version and one more diplomatic version.\n\nMessage: \"\"\"{{message}}\"\"\"",
  },
  {
    id: "creative-brief",
    title: "Creative brief builder",
    category: "Art & Design",
    summary: "Turn a loose visual idea into an actionable brief, reference direction, and constraints.",
    accent: "#B15D8B",
    fields: [
      { key: "idea", label: "Creative idea", placeholder: "Describe the idea, theme, or piece" },
      { key: "audience", label: "Audience or setting", placeholder: "Gallery, client, portfolio, social campaign, etc." },
      { key: "medium", label: "Medium", placeholder: "Illustration, mural, photography, ceramic, music, video..." },
    ],
    prompt:
      "Act as a thoughtful creative director. Turn this idea into a practical brief for {{medium}} intended for {{audience}}: {{idea}}. Include a concept statement, emotional palette, visual or sensory references described in words, composition or structure options, production constraints, an experiment plan, and five questions that would sharpen the work. Do not imitate a living artist's signature style; describe techniques and qualities instead.",
  },
  {
    id: "portfolio-story",
    title: "Portfolio story",
    category: "Art & Design",
    summary: "Explain a creative project clearly without turning the artist statement into jargon.",
    accent: "#B15D8B",
    fields: [
      { key: "project", label: "Project notes", placeholder: "Material, process, decisions, and intent", multiline: true },
      { key: "audience", label: "Reader", placeholder: "Curator, client, grant panel, or general audience" },
    ],
    prompt:
      "Write a concise portfolio story about this project for {{audience}}. Preserve the artist's own intent and concrete process. Include: one-sentence premise, material/process, key decisions, viewer experience, and an honest note about what remains unresolved. Avoid inflated arts jargon and unsupported claims.\n\nProject notes: \"\"\"{{project}}\"\"\"",
  },
  {
    id: "investigation-plan",
    title: "Investigation plan",
    category: "Research",
    summary: "Structure a lawful, source-aware inquiry without treating assumptions as evidence.",
    accent: "#3F7F69",
    fields: [
      { key: "question", label: "Question to investigate", placeholder: "What do you need to establish?" },
      { key: "scope", label: "Scope", placeholder: "Jurisdiction, dates, entities, or source boundary" },
    ],
    safetyNote: "Use for lawful public-interest research. Do not use to expose sensitive personal information or bypass access controls.",
    prompt:
      "Build a lawful investigation plan for this question: {{question}}. Scope: {{scope}}. Separate known facts, assumptions, unknowns, and testable hypotheses. Identify likely official sources, source-quality risks, disconfirming evidence to seek, a source log structure, and the next five research actions. Do not infer wrongdoing without evidence and do not suggest accessing non-public systems or private personal data.",
  },
  {
    id: "judicial-review-map",
    title: "Judicial review research map",
    category: "Judicial Review",
    summary: "Organize public legal materials into questions, sources, procedural posture, and gaps.",
    accent: "#6C5BA7",
    fields: [
      { key: "issue", label: "Issue or decision", placeholder: "The public decision or legal issue you are researching" },
      { key: "jurisdiction", label: "Jurisdiction", placeholder: "Court, state, federal, or other jurisdiction" },
    ],
    safetyNote: "Educational research support only, not legal advice. Verify current law, rules, and deadlines with qualified counsel or the relevant court.",
    prompt:
      "For educational research only, create a judicial-review research map for {{issue}} in {{jurisdiction}}. Identify potential procedural posture, public primary-source categories, official court or agency portals, key questions of authority, timeline facts to verify, standard-of-review questions to research, and missing documents. Separate verified public facts from legal issues requiring further research. Do not provide legal advice or state that a filing is timely, viable, or likely to succeed.",
  },
  {
    id: "trade-job-scope",
    title: "Trade job scope",
    category: "Trades",
    summary: "Convert a job description into an organized inspection, material, and customer-question checklist.",
    accent: "#C47032",
    fields: [
      { key: "trade", label: "Trade", placeholder: "Electrician, plumber, HVAC, or general maintenance" },
      { key: "job", label: "Job description", placeholder: "Describe the reported issue and site context" },
      { key: "constraints", label: "Constraints", placeholder: "Budget, timeline, code, access, or customer needs" },
    ],
    safetyNote: "Planning and communication aid only. Verify local code, manufacturer instructions, site conditions, permits, and licensure requirements; do not use for live or hazardous work instructions.",
    prompt:
      "Act as an operations assistant for a {{trade}}. Turn this job description into a safe pre-visit scope: {{job}}. Consider these constraints: {{constraints}}. Return customer questions, site observations to verify, likely material categories, permit or code checks to confirm locally, documentation to capture, work-sequence milestones, and a concise customer-facing scope note. Do not provide instructions for live electrical work, gas work, or other hazardous procedures. Flag when licensed or emergency service is appropriate.",
  },
  {
    id: "customer-estimate",
    title: "Customer estimate explainer",
    category: "Trades",
    summary: "Explain a proposed repair or installation in clear language without overpromising.",
    accent: "#C47032",
    fields: [
      { key: "trade", label: "Trade", placeholder: "Electrician, plumber, etc." },
      { key: "scope", label: "Scope details", placeholder: "What was observed and proposed?", multiline: true },
      { key: "audience", label: "Customer type", placeholder: "Homeowner, property manager, or facilities lead" },
    ],
    safetyNote: "Use an on-site professional assessment and local requirements to confirm scope and pricing.",
    prompt:
      "Write a clear estimate explanation for a {{trade}} professional to send to a {{audience}}. Use only these scope details: \"\"\"{{scope}}\"\"\". Explain the observed issue, proposed work categories, assumptions, what is excluded, customer decisions needed, and what must be verified on site. Avoid guarantees, legal claims, or exact code assertions unless they are documented.",
  },
  {
    id: "study-plan",
    title: "Study plan",
    category: "Education",
    summary: "Build a realistic learning path with practice, recall, and review instead of passive reading.",
    accent: "#4E83B8",
    fields: [
      { key: "subject", label: "Subject", placeholder: "Topic or exam area" },
      { key: "deadline", label: "Deadline", placeholder: "Exam or target date" },
      { key: "time", label: "Available time", placeholder: "Hours per week and known constraints" },
    ],
    prompt:
      "Create an active-learning study plan for {{subject}} by {{deadline}} with {{time}}. Start by identifying the highest-leverage prerequisites. Then create weekly goals, short practice sessions, retrieval-practice questions, error-review prompts, and a weekly self-test. Ask me one diagnostic question before assuming my current level. Do not overfill the plan; prioritize work I can actually complete.",
  },
  {
    id: "teach-back",
    title: "Teach-back coach",
    category: "Education",
    summary: "Use explanation and targeted correction to find weak spots in understanding.",
    accent: "#4E83B8",
    fields: [{ key: "topic", label: "Topic", placeholder: "What do you want to learn or explain?" }],
    prompt:
      "Coach me through a teach-back on {{topic}}. Ask me to explain the concept in my own words, then identify only the most important gap or misconception. Give one concise correction, one example, and one harder follow-up question. Do not reveal a full answer before I attempt the explanation.",
  },
  {
    id: "decision-matrix",
    title: "Decision matrix",
    category: "Everyday",
    summary: "Compare choices without pretending that a personal decision has one objective answer.",
    accent: "#687281",
    fields: [
      { key: "decision", label: "Decision", placeholder: "What are you deciding?" },
      { key: "options", label: "Options", placeholder: "List the alternatives" },
      { key: "priorities", label: "Priorities", placeholder: "Cost, time, risk, reversibility, values..." },
    ],
    prompt:
      "Help me make a decision about {{decision}}. Compare these options: {{options}}. My priorities are: {{priorities}}. First identify the criteria that genuinely change the choice. Then create a decision matrix, mark unknown information as unknown, explain key trade-offs, and identify the two facts that would most change the result. Do not make the decision for me.",
  },
  {
    id: "weekly-reset",
    title: "Weekly reset",
    category: "Everyday",
    summary: "Turn a busy week into an honest, prioritized reset with room for real life.",
    accent: "#687281",
    fields: [
      { key: "tasks", label: "Current tasks and obligations", placeholder: "Paste errands, work items, and obligations", multiline: true },
      { key: "constraints", label: "Constraints", placeholder: "Energy, caregiving, deadlines, time windows" },
    ],
    prompt:
      "Create a realistic weekly reset from these tasks: \"\"\"{{tasks}}\"\"\". Constraints: {{constraints}}. Sort work into must do, should do, can defer, and needs clarification. Then propose a lightweight week plan with the three highest-value actions, one recovery block, and a short end-of-week review. Do not assume unlimited time or energy.",
  },
];

export function getPromptById(id: string | string[] | undefined) {
  const promptId = Array.isArray(id) ? id[0] : id;
  return promptTemplates.find((template) => template.id === promptId) ?? promptTemplates[0];
}
