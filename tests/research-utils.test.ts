import { describe, expect, it } from "vitest";

import { buildHandoff } from "../lib/research-utils";
import type { ResearchKit } from "../lib/storage";

describe("research handoff", () => {
  it("preserves source identifiers and verified evidence in the handoff packet", () => {
    const kit: ResearchKit = {
      id: "kit-1",
      name: "Permit review",
      objective: "Check the approval record.",
      activeQuestion: "Was the amendment approved?",
      updatedAt: "",
      sources: [
        { id: "source-1", sourceId: "S-01", issuer: "City Clerk", recordDate: "2026-04-14", recordType: "Minutes", relevance: "Approval language" },
      ],
      evidence: [{ id: "evidence-1", sourceId: "S-01", page: "p. 4", quote: "The amendment was approved.", status: "Direct quote" }],
    };

    const packet = buildHandoff(kit);

    expect(packet).toContain("Permit review");
    expect(packet).toContain("S-01 | City Clerk");
    expect(packet).toContain("[S-01, p. 4] The amendment was approved.");
  });
});
