import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { OpenAIConnectionCard } from "@/components/openai-connection-card";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";

const customInstructions = `For public-records and evidence-based research, prefer official primary sources and treat search results as leads, not proof. Separate Verified fact, Direct quote, Inference, Unknown, and Needs verification. Never invent citations, quotes, dates, agency actions, legal rules, or facts.\n\nFor material claims, provide issuer, date, official URL, and exact support or page/section when available. Treat absence from Google or a web search as inconclusive. For long material, create a source index and use labeled excerpts. End multi-step work with a carry-forward brief. Write clearly, flag uncertainty, and protect private personal information.`;

const memoryEntries = [
  "I prefer official primary sources for factual and public-records research; remembered context is not evidence.",
  "I maintain an external source spine and claim log. Ask for the relevant source IDs or a carry-forward brief before relying on project-specific facts.",
  "For lengthy research, I prefer compact, question-specific source packets instead of large document dumps.",
  "I want material points labeled as verified fact, direct quote, inference, unknown, or needs verification.",
  "I prefer clear, direct, respectful plain language with the purpose, evidence, uncertainty, and next action made explicit.",
];

export default function SettingsScreen() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (id: string, value: string) => {
    await Clipboard.setStringAsync(value);
    haptic.success();
    setCopied(id);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>WORKING DEFAULTS</Text>
        <Text style={styles.title}>Make careful work the easy default.</Text>
        <Text style={styles.description}>These short blocks are built to paste into your ChatGPT Custom Instructions and Memory. They set preferences, not evidence.</Text>

        <View style={styles.tipCard}>
          <MaterialIcons name="privacy-tip" size={21} color="#6C5BA7" />
          <Text style={styles.tipText}>Keep current case facts, source URLs, and changing research conclusions in your own archive, not persistent memory.</Text>
        </View>

        <OpenAIConnectionCard />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Custom Instructions</Text>
          <Text style={styles.helper}>Paste once</Text>
        </View>
        <View style={styles.copyCard}>
          <Text style={styles.copyText} numberOfLines={8}>{customInstructions}</Text>
          <Pressable onPress={() => copy("instructions", customInstructions)} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <MaterialIcons name={copied === "instructions" ? "check" : "content-copy"} size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>{copied === "instructions" ? "Copied" : "Copy instructions"}</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Memory entries</Text>
          <Text style={styles.helper}>Add only what stays true</Text>
        </View>
        {memoryEntries.map((entry, index) => (
          <View key={entry} style={styles.memoryRow}>
            <View style={styles.memoryIndex}><Text style={styles.memoryIndexText}>{index + 1}</Text></View>
            <Text style={styles.memoryText}>{entry}</Text>
            <Pressable onPress={() => copy(`memory-${index}`, entry)} hitSlop={8} style={({ pressed }) => [styles.memoryCopy, pressed && styles.textPressed]}>
              <MaterialIcons name={copied === `memory-${index}` ? "check" : "content-copy"} size={19} color="#146C94" />
            </Pressable>
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Session protocol</Text>
          <Text style={styles.helper}>Paste at the start of research</Text>
        </View>
        <View style={styles.protocolCard}>
          <Text style={styles.protocolText}>Protocol: official sources first; use only supplied sources unless asked; label fact/quote/inference/unknown; cite source ID and page; no invented support; finish with next verification action.</Text>
          <Pressable onPress={() => copy("protocol", "Protocol: official sources first; use only supplied sources unless asked; label fact/quote/inference/unknown; cite source ID and page; no invented support; finish with next verification action.")} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>{copied === "protocol" ? "Copied" : "Copy protocol"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 36, paddingTop: 14 },
  eyebrow: { color: "#146C94", fontSize: 11, fontWeight: "800", letterSpacing: 1.35 },
  title: { color: "#10233E", fontSize: 27, fontWeight: "800", letterSpacing: -0.75, lineHeight: 33, marginTop: 5 },
  description: { color: "#687281", fontSize: 14, lineHeight: 20, marginTop: 9 },
  tipCard: { alignItems: "flex-start", backgroundColor: "#F3EFFA", borderColor: "#DED5F0", borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 10, marginTop: 18, padding: 14 },
  tipText: { color: "#5B5077", flex: 1, fontSize: 13, lineHeight: 18 },
  sectionHeader: { alignItems: "baseline", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, marginTop: 27 },
  sectionTitle: { color: "#10233E", fontSize: 18, fontWeight: "800" },
  helper: { color: "#687281", fontSize: 11 },
  copyCard: { backgroundColor: "#FFFFFF", borderColor: "#E0E6EB", borderRadius: 19, borderWidth: 1, padding: 15 },
  copyText: { color: "#33475B", fontSize: 13, lineHeight: 19 },
  primaryButton: { alignItems: "center", backgroundColor: "#10233E", borderRadius: 13, flexDirection: "row", gap: 7, justifyContent: "center", marginTop: 15, minHeight: 45, paddingHorizontal: 14 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  memoryRow: { alignItems: "center", backgroundColor: "#FFFFFF", borderBottomColor: "#E6EAEE", borderBottomWidth: 1, flexDirection: "row", minHeight: 86, paddingHorizontal: 13 },
  memoryIndex: { alignItems: "center", backgroundColor: "#EAF2F8", borderRadius: 11, height: 28, justifyContent: "center", width: 28 },
  memoryIndexText: { color: "#146C94", fontSize: 12, fontWeight: "800" },
  memoryText: { color: "#33475B", flex: 1, fontSize: 13, lineHeight: 18, marginHorizontal: 11 },
  memoryCopy: { padding: 7 },
  protocolCard: { backgroundColor: "#FFF5E8", borderColor: "#F1D6B4", borderRadius: 19, borderWidth: 1, padding: 15 },
  protocolText: { color: "#705029", fontSize: 13, lineHeight: 19 },
  secondaryButton: { alignItems: "center", alignSelf: "flex-start", borderColor: "#C47032", borderRadius: 12, borderWidth: 1, marginTop: 13, paddingHorizontal: 12, paddingVertical: 9 },
  secondaryButtonText: { color: "#A15923", fontSize: 13, fontWeight: "800" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  textPressed: { opacity: 0.5 },
});
