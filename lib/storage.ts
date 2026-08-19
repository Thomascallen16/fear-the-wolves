import AsyncStorage from "@react-native-async-storage/async-storage";

export type SourceEntry = {
  id: string;
  sourceId: string;
  issuer: string;
  recordDate: string;
  recordType: string;
  relevance: string;
};

export type EvidenceCard = {
  id: string;
  sourceId: string;
  page: string;
  quote: string;
  status: string;
};

export type ResearchKit = {
  id: string;
  name: string;
  objective: string;
  activeQuestion: string;
  sources: SourceEntry[];
  evidence: EvidenceCard[];
  updatedAt: string;
};

const KIT_KEY = "prompt-bridge.research-kit.v1";
const FAVORITES_KEY = "prompt-bridge.favorites.v1";

export const starterKit: ResearchKit = {
  id: "kit-1",
  name: "Current research kit",
  objective: "Keep the next question focused and source-aware.",
  activeQuestion: "What is the smallest evidence set needed for the next decision?",
  updatedAt: "",
  sources: [
    {
      id: "source-1",
      sourceId: "S-01",
      issuer: "Official source",
      recordDate: "",
      recordType: "Record or note",
      relevance: "Add the relevant pages or key purpose.",
    },
  ],
  evidence: [],
};

export async function loadResearchKit(): Promise<ResearchKit> {
  try {
    const raw = await AsyncStorage.getItem(KIT_KEY);
    if (!raw) return starterKit;
    return JSON.parse(raw) as ResearchKit;
  } catch {
    return starterKit;
  }
}

export async function saveResearchKit(kit: ResearchKit) {
  await AsyncStorage.setItem(KIT_KEY, JSON.stringify({ ...kit, updatedAt: new Date().toISOString() }));
}

export async function loadFavorites() {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveFavorites(ids: string[]) {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function createSourceEntry(index: number): SourceEntry {
  return {
    id: `source-${Date.now()}-${index}`,
    sourceId: `S-${String(index + 1).padStart(2, "0")}`,
    issuer: "",
    recordDate: "",
    recordType: "",
    relevance: "",
  };
}
