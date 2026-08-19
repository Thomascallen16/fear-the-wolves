import type { PromptTemplate } from "./prompt-data";

export type PromptValues = Record<string, string>;

export function renderPrompt(template: PromptTemplate, values: PromptValues) {
  return template.prompt.replace(/\{\{(.*?)\}\}/g, (_, rawKey: string) => {
    const key = rawKey.trim();
    const value = values[key]?.trim();
    return value || `[${key}]`;
  });
}

export function createDefaultValues(template: PromptTemplate): PromptValues {
  return Object.fromEntries(template.fields.map((field) => [field.key, ""]));
}

export function categoryColor(category: PromptTemplate["category"]) {
  const colors: Record<PromptTemplate["category"], string> = {
    Research: "#3F7F69",
    Records: "#146C94",
    Communication: "#10233E",
    Context: "#B36F23",
    "Art & Design": "#B15D8B",
    Trades: "#C47032",
    "Judicial Review": "#6C5BA7",
    Education: "#4E83B8",
    Everyday: "#687281",
  };
  return colors[category];
}
