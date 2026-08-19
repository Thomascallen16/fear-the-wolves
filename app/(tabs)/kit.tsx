import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { buildHandoff } from "@/lib/research-utils";
import { createSourceEntry, loadResearchKit, saveResearchKit, type EvidenceCard, type ResearchKit, type SourceEntry, starterKit } from "@/lib/storage";

export default function KitScreen() {
  const [kit, setKit] = useState<ResearchKit>(starterKit);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void loadResearchKit().then((savedKit) => {
      setKit(savedKit);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((next: ResearchKit) => {
    setKit(next);
    void saveResearchKit(next);
  }, []);

  const updateKitField = (field: "name" | "objective" | "activeQuestion", value: string) => {
    persist({ ...kit, [field]: value });
  };

  const updateSource = (id: string, field: keyof SourceEntry, value: string) => {
    persist({ ...kit, sources: kit.sources.map((source) => (source.id === id ? { ...source, [field]: value } : source)) });
  };

  const addSource = () => {
    haptic.light();
    persist({ ...kit, sources: [...kit.sources, createSourceEntry(kit.sources.length)] });
  };

  const updateEvidence = (id: string, field: keyof EvidenceCard, value: string) => {
    persist({ ...kit, evidence: kit.evidence.map((card) => (card.id === id ? { ...card, [field]: value } : card)) });
  };

  const addEvidence = () => {
    haptic.light();
    persist({
      ...kit,
      evidence: [
        ...kit.evidence,
        { id: `evidence-${Date.now()}`, sourceId: kit.sources[0]?.sourceId || "S-01", page: "", quote: "", status: "Direct quote" },
      ],
    });
  };

  const copyHandoff = async () => {
    await Clipboard.setStringAsync(buildHandoff(kit));
    haptic.success();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const renderSource = ({ item, index }: { item: SourceEntry; index: number }) => (
    <View style={styles.sourceCard}>
      <View style={styles.sourceHeading}>
        <Text style={styles.sourceNumber}>SOURCE {String(index + 1).padStart(2, "0")}</Text>
        <TextInput value={item.sourceId} onChangeText={(value) => updateSource(item.id, "sourceId", value)} placeholder="S-01" placeholderTextColor="#88919E" style={styles.sourceId} />
      </View>
      <TextInput value={item.issuer} onChangeText={(value) => updateSource(item.id, "issuer", value)} placeholder="Issuing body or official source" placeholderTextColor="#88919E" style={styles.sourceInput} />
      <View style={styles.sourceGrid}>
        <TextInput value={item.recordDate} onChangeText={(value) => updateSource(item.id, "recordDate", value)} placeholder="Record date" placeholderTextColor="#88919E" style={[styles.sourceInput, styles.halfInput]} />
        <TextInput value={item.recordType} onChangeText={(value) => updateSource(item.id, "recordType", value)} placeholder="Record type" placeholderTextColor="#88919E" style={[styles.sourceInput, styles.halfInput]} />
      </View>
      <TextInput value={item.relevance} onChangeText={(value) => updateSource(item.id, "relevance", value)} placeholder="Why this source matters or pages to revisit" placeholderTextColor="#88919E" style={[styles.sourceInput, styles.relevanceInput]} multiline />
    </View>
  );

  const renderEvidence = ({ item, index }: { item: EvidenceCard; index: number }) => (
    <View style={styles.evidenceCard}>
      <View style={styles.sourceHeading}>
        <Text style={styles.evidenceNumber}>EVIDENCE {String(index + 1).padStart(2, "0")}</Text>
        <View style={styles.evidenceMeta}>
          <TextInput value={item.sourceId} onChangeText={(value) => updateEvidence(item.id, "sourceId", value)} placeholder="S-01" placeholderTextColor="#88919E" style={styles.evidenceShortInput} />
          <TextInput value={item.page} onChangeText={(value) => updateEvidence(item.id, "page", value)} placeholder="p. 1" placeholderTextColor="#88919E" style={styles.evidenceShortInput} />
        </View>
      </View>
      <TextInput value={item.quote} onChangeText={(value) => updateEvidence(item.id, "quote", value)} placeholder="Exact quotation or source-aware fact" placeholderTextColor="#88919E" multiline textAlignVertical="top" style={styles.evidenceQuote} />
      <TextInput value={item.status} onChangeText={(value) => updateEvidence(item.id, "status", value)} placeholder="Direct quote, verified fact, or inference" placeholderTextColor="#88919E" style={styles.evidenceStatus} />
    </View>
  );

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <FlatList
        data={kit.sources}
        keyExtractor={(item) => item.id}
        renderItem={renderSource}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>RESEARCH KIT</Text>
            <Text style={styles.title}>A small research state that survives a new chat.</Text>
            <Text style={styles.description}>Save the question, preserve only the relevant sources, then create a clean handoff when it is time to continue.</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>KIT NAME</Text>
              <TextInput value={kit.name} onChangeText={(value) => updateKitField("name", value)} placeholder="Current research kit" placeholderTextColor="#88919E" style={styles.primaryInput} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>OBJECTIVE</Text>
              <TextInput value={kit.objective} onChangeText={(value) => updateKitField("objective", value)} placeholder="What is this research trying to establish?" placeholderTextColor="#88919E" style={[styles.primaryInput, styles.multilineInput]} multiline />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ACTIVE QUESTION</Text>
              <TextInput value={kit.activeQuestion} onChangeText={(value) => updateKitField("activeQuestion", value)} placeholder="What needs an answer next?" placeholderTextColor="#88919E" style={[styles.primaryInput, styles.multilineInput]} multiline />
            </View>

            <View style={styles.handoffCard}>
              <View style={styles.handoffIcon}><MaterialIcons name="content-copy" size={21} color="#10233E" /></View>
              <View style={styles.handoffCopy}>
                <Text style={styles.handoffTitle}>{copied ? "Handoff copied" : "Make a compact handoff"}</Text>
                <Text style={styles.handoffText}>This creates a source-aware packet you can paste into a fresh chat.</Text>
              </View>
              <Pressable onPress={copyHandoff} style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}>
                <Text style={styles.copyButtonText}>{copied ? "Copied" : "Create"}</Text>
              </Pressable>
            </View>

            <View style={styles.sourcesHeader}>
              <Text style={styles.sourcesTitle}>Source spine</Text>
              <Pressable onPress={addSource} style={({ pressed }) => [styles.addSource, pressed && styles.textPressed]}>
                <MaterialIcons name="add" size={17} color="#146C94" />
                <Text style={styles.addSourceText}>Add source</Text>
              </Pressable>
            </View>
            {!loaded ? <Text style={styles.loadingText}>Loading your local kit…</Text> : null}
          </View>
        }
        ListFooterComponent={
          <View>
            <View style={styles.sourcesHeader}>
              <Text style={styles.sourcesTitle}>Evidence cards</Text>
              <Pressable onPress={addEvidence} style={({ pressed }) => [styles.addSource, pressed && styles.textPressed]}>
                <MaterialIcons name="add" size={17} color="#146C94" />
                <Text style={styles.addSourceText}>Add evidence</Text>
              </Pressable>
            </View>
            {kit.evidence.length ? (
              <FlatList data={kit.evidence} keyExtractor={(item) => item.id} renderItem={renderEvidence} scrollEnabled={false} />
            ) : (
              <Text style={styles.emptyEvidence}>Add a short quote, page label, or verified fact to make the handoff more useful.</Text>
            )}
            <Text style={styles.footerNote}>Source entries stay on this device. Keep original records and official URLs in your own archive.</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 36, paddingTop: 14 },
  eyebrow: { color: "#146C94", fontSize: 11, fontWeight: "800", letterSpacing: 1.35 },
  title: { color: "#10233E", fontSize: 27, fontWeight: "800", letterSpacing: -0.75, lineHeight: 33, marginTop: 5 },
  description: { color: "#687281", fontSize: 14, lineHeight: 20, marginTop: 9 },
  fieldGroup: { marginTop: 18 },
  fieldLabel: { color: "#687281", fontSize: 10, fontWeight: "800", letterSpacing: 1.2, marginBottom: 7 },
  primaryInput: { backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 15, borderWidth: 1, color: "#10233E", fontSize: 15, minHeight: 50, paddingHorizontal: 13, paddingVertical: 12 },
  multilineInput: { minHeight: 70, textAlignVertical: "top" },
  handoffCard: { alignItems: "center", backgroundColor: "#EAF2F8", borderColor: "#CFE2EF", borderRadius: 19, borderWidth: 1, flexDirection: "row", marginTop: 20, padding: 13 },
  handoffIcon: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12, height: 40, justifyContent: "center", width: 40 },
  handoffCopy: { flex: 1, marginLeft: 10 },
  handoffTitle: { color: "#10233E", fontSize: 14, fontWeight: "800" },
  handoffText: { color: "#52728A", fontSize: 12, lineHeight: 16, marginTop: 2 },
  copyButton: { backgroundColor: "#10233E", borderRadius: 11, paddingHorizontal: 12, paddingVertical: 9 },
  copyButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  sourcesHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 11, marginTop: 27 },
  sourcesTitle: { color: "#10233E", fontSize: 18, fontWeight: "800" },
  addSource: { alignItems: "center", flexDirection: "row", gap: 3, padding: 5 },
  addSourceText: { color: "#146C94", fontSize: 13, fontWeight: "800" },
  loadingText: { color: "#687281", fontSize: 13, marginBottom: 8 },
  sourceCard: { backgroundColor: "#FFFFFF", borderColor: "#E1E6EB", borderRadius: 18, borderWidth: 1, marginBottom: 12, padding: 14 },
  sourceHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sourceNumber: { color: "#146C94", fontSize: 10, fontWeight: "800", letterSpacing: 1.05 },
  sourceId: { color: "#10233E", fontSize: 13, fontWeight: "800", minWidth: 55, textAlign: "right" },
  sourceInput: { borderBottomColor: "#E4E8EC", borderBottomWidth: 1, color: "#10233E", fontSize: 14, minHeight: 39, paddingVertical: 8 },
  sourceGrid: { flexDirection: "row", gap: 12 },
  halfInput: { flex: 1 },
  relevanceInput: { borderBottomWidth: 0, minHeight: 52, textAlignVertical: "top" },
  evidenceCard: { backgroundColor: "#F9FBFC", borderColor: "#DCE5EA", borderRadius: 18, borderWidth: 1, marginBottom: 12, padding: 14 },
  evidenceNumber: { color: "#3F7F69", fontSize: 10, fontWeight: "800", letterSpacing: 1.05 },
  evidenceMeta: { flexDirection: "row", gap: 7 },
  evidenceShortInput: { backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 8, borderWidth: 1, color: "#10233E", fontSize: 12, minHeight: 29, paddingHorizontal: 8, textAlign: "center", width: 57 },
  evidenceQuote: { backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 11, borderWidth: 1, color: "#10233E", fontSize: 13, lineHeight: 18, marginTop: 9, minHeight: 74, padding: 10 },
  evidenceStatus: { color: "#527765", fontSize: 12, minHeight: 34, paddingTop: 9 },
  emptyEvidence: { color: "#687281", fontSize: 13, lineHeight: 18, marginBottom: 16 },
  footerNote: { color: "#687281", fontSize: 12, lineHeight: 18, paddingHorizontal: 2, paddingTop: 5 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  textPressed: { opacity: 0.55 },
});
