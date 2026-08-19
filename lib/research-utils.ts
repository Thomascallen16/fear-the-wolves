import type { ResearchKit } from "./storage";

export function buildHandoff(kit: ResearchKit) {
  const sources = kit.sources
    .filter((source) => source.issuer || source.relevance)
    .map(
      (source) =>
        `${source.sourceId} | ${source.issuer || "Unknown issuer"} | ${source.recordDate || "Date unknown"} | ${source.recordType || "Record type unknown"} | ${source.relevance || "Relevance not yet noted"}`,
    )
    .join("\n");

  const evidence = kit.evidence
    .filter((card) => card.quote)
    .map((card) => `[${card.sourceId}${card.page ? `, ${card.page}` : ""}] ${card.quote}`)
    .join("\n");

  return `# Research protocol\nTreat this packet as current working context. Use only the source packet as evidence. Label material points as Verified fact, Direct quote, Inference, Unknown, or Needs verification.\n\n# Project\n${kit.name}\n\n# Objective\n${kit.objective}\n\n# Active question\n${kit.activeQuestion}\n\n# Relevant source-spine rows\n${sources || "[Add source rows before handoff]"}\n\n# Verified evidence cards\n${evidence || "[No verified evidence cards yet]"}\n\n# Requested output\nIdentify the smallest evidence set needed next, then produce a source-aware response.`;
}
