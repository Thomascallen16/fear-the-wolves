import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { startOAuthLogin } from "@/constants/oauth";
import { useAuth } from "@/hooks/use-auth";
import { haptic } from "@/lib/haptics";
import { trpc } from "@/lib/trpc";

const modes = [
  { id: "refine", label: "Refine", description: "Make a better prompt" },
  { id: "research", label: "Research", description: "Plan the next source step" },
  { id: "communication", label: "Message", description: "Make the point clearly" },
  { id: "task", label: "Task", description: "Turn an idea into action" },
] as const;

type AssistantMode = (typeof modes)[number]["id"];

export default function AssistScreen() {
  const { isAuthenticated, loading } = useAuth();
  const connection = trpc.openai.status.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const assist = trpc.openai.assist.useMutation();
  const [mode, setMode] = useState<AssistantMode>("refine");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!prompt.trim()) {
      setError("Write the request you want help with first.");
      return;
    }
    try {
      setError(null);
      const result = await assist.mutateAsync({ mode, prompt: prompt.trim(), context: context.trim() || undefined });
      haptic.success();
      setAnswer(result.answer);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The assistant could not complete that request.");
    }
  };

  const isConnected = Boolean(connection.data?.connected);

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>YOUR CONNECTED ASSISTANT</Text>
        <Text style={styles.title}>Work through the next move.</Text>
        <Text style={styles.description}>Prompt Bridge uses the OpenAI key connected to your signed-in account. Your key is never shown here or sent back to the device.</Text>

        {loading ? (
          <View style={styles.loadingCard}><ActivityIndicator color="#6C5BA7" /><Text style={styles.loadingText}>Checking your connection…</Text></View>
        ) : !isAuthenticated ? (
          <View style={styles.gateCard}>
            <MaterialIcons name="account-circle" size={28} color="#6C5BA7" />
            <Text style={styles.gateTitle}>Sign in to use your own key.</Text>
            <Text style={styles.gateText}>Your OpenAI connection belongs to your account, not this device.</Text>
            <Pressable onPress={() => void startOAuthLogin()} style={({ pressed }) => [styles.gateButton, pressed && styles.pressed]}><Text style={styles.gateButtonText}>Sign in</Text></Pressable>
          </View>
        ) : !isConnected ? (
          <View style={styles.gateCard}>
            <MaterialIcons name="vpn-key" size={28} color="#C47032" />
            <Text style={styles.gateTitle}>Connect your OpenAI key first.</Text>
            <Text style={styles.gateText}>Add a personal OpenAI Platform API key in Settings. ChatGPT subscriptions and Expo credentials do not connect this assistant.</Text>
            <Pressable onPress={() => router.push("/settings" as never)} style={({ pressed }) => [styles.gateButton, pressed && styles.pressed]}><Text style={styles.gateButtonText}>Open settings</Text></Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>CHOOSE A WORK MODE</Text>
            <View style={styles.modeGrid}>
              {modes.map((item) => {
                const selected = mode === item.id;
                return (
                  <Pressable key={item.id} onPress={() => { haptic.selection(); setMode(item.id); }} style={({ pressed }) => [styles.modeCard, selected && styles.modeCardSelected, pressed && styles.pressed]}>
                    <Text style={[styles.modeLabel, selected && styles.modeLabelSelected]}>{item.label}</Text>
                    <Text style={[styles.modeDescription, selected && styles.modeDescriptionSelected]}>{item.description}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.sectionLabel}>WHAT DO YOU WANT TO DO?</Text>
              <TextInput value={prompt} onChangeText={setPrompt} placeholder="Describe the prompt, source question, message, or task…" placeholderTextColor="#88919E" multiline textAlignVertical="top" selectionColor="#146C94" style={styles.requestInput} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.sectionLabel}>CONTEXT · OPTIONAL</Text>
              <TextInput value={context} onChangeText={setContext} placeholder="Paste only the source excerpt, draft, or constraints that matter…" placeholderTextColor="#88919E" multiline textAlignVertical="top" selectionColor="#146C94" style={styles.contextInput} />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable onPress={() => void send()} disabled={assist.isPending} style={({ pressed }) => [styles.sendButton, pressed && styles.pressed, assist.isPending && styles.disabled]}>
              {assist.isPending ? <ActivityIndicator color="#FFFFFF" /> : <MaterialIcons name="auto-awesome" size={19} color="#FFFFFF" />}
              <Text style={styles.sendButtonText}>{assist.isPending ? "Working…" : "Ask Prompt Bridge"}</Text>
            </Pressable>
            {answer ? (
              <View style={styles.answerCard}>
                <View style={styles.answerHeader}><Text style={styles.answerKicker}>PROMPT BRIDGE</Text><View style={styles.answerDot} /></View>
                <Text selectable style={styles.answerText}>{answer}</Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 36, paddingTop: 14 },
  eyebrow: { color: "#6C5BA7", fontSize: 11, fontWeight: "800", letterSpacing: 1.3 },
  title: { color: "#10233E", fontSize: 29, fontWeight: "800", letterSpacing: -0.85, lineHeight: 35, marginTop: 5 },
  description: { color: "#687281", fontSize: 14, lineHeight: 20, marginTop: 8 },
  loadingCard: { alignItems: "center", backgroundColor: "#F3EFFA", borderRadius: 18, flexDirection: "row", gap: 9, marginTop: 20, padding: 15 },
  loadingText: { color: "#5B5077", fontSize: 13 },
  gateCard: { alignItems: "center", backgroundColor: "#F3EFFA", borderColor: "#DDD4EE", borderRadius: 21, borderWidth: 1, marginTop: 22, padding: 22 },
  gateTitle: { color: "#322657", fontSize: 18, fontWeight: "800", marginTop: 11, textAlign: "center" },
  gateText: { color: "#5B5077", fontSize: 13, lineHeight: 19, marginTop: 5, textAlign: "center" },
  gateButton: { backgroundColor: "#6C5BA7", borderRadius: 13, marginTop: 16, minWidth: 130, paddingHorizontal: 16, paddingVertical: 12 },
  gateButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", textAlign: "center" },
  sectionLabel: { color: "#687281", fontSize: 10, fontWeight: "800", letterSpacing: 1.05, marginBottom: 8, marginTop: 23 },
  modeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  modeCard: { backgroundColor: "#FFFFFF", borderColor: "#DDE4EA", borderRadius: 16, borderWidth: 1, padding: 13, width: "48.2%" },
  modeCardSelected: { backgroundColor: "#6C5BA7", borderColor: "#6C5BA7" },
  modeLabel: { color: "#10233E", fontSize: 15, fontWeight: "800" },
  modeLabelSelected: { color: "#FFFFFF" },
  modeDescription: { color: "#687281", fontSize: 12, lineHeight: 16, marginTop: 3 },
  modeDescriptionSelected: { color: "#E7E1F6" },
  fieldGroup: { marginTop: 0 },
  requestInput: { backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 16, borderWidth: 1, color: "#10233E", fontSize: 15, minHeight: 116, padding: 13 },
  contextInput: { backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 16, borderWidth: 1, color: "#10233E", fontSize: 14, minHeight: 86, padding: 13 },
  sendButton: { alignItems: "center", backgroundColor: "#6C5BA7", borderRadius: 15, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 16, minHeight: 51 },
  sendButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  answerCard: { backgroundColor: "#FFFFFF", borderColor: "#DDE4EA", borderRadius: 20, borderWidth: 1, marginTop: 20, padding: 16 },
  answerHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  answerKicker: { color: "#6C5BA7", fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  answerDot: { backgroundColor: "#F3A75A", borderRadius: 4, height: 8, width: 8 },
  answerText: { color: "#2D4256", fontSize: 14, lineHeight: 21, marginTop: 11 },
  errorText: { color: "#A73F50", fontSize: 12, lineHeight: 17, marginTop: 11 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.55 },
});
