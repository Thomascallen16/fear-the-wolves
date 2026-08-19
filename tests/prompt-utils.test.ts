import { describe, expect, it } from "vitest";

import { getPromptById } from "../lib/prompt-data";
import { createDefaultValues, renderPrompt } from "../lib/prompt-utils";

describe("prompt renderer", () => {
  it("renders supplied values into a prompt template", () => {
    const template = getPromptById("claim-audit");
    const prompt = renderPrompt(template, { claim: "The order was final.", source: "S-01, page 4" });

    expect(prompt).toContain("The order was final.");
    expect(prompt).toContain("S-01, page 4");
    expect(prompt).not.toContain("{{claim}}");
  });

  it("keeps missing values visible as placeholders", () => {
    const template = getPromptById("records-map");
    const defaults = createDefaultValues(template);
    const prompt = renderPrompt(template, defaults);

    expect(prompt).toContain("[topic]");
    expect(prompt).toContain("[jurisdiction]");
  });
});
