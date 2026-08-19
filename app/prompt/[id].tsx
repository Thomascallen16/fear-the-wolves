import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { getPromptById } from "@/lib/prompt-data";
import { createDefaultValues, renderPrompt } from "@/lib/prompt-utils";

export default function PromptStudioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prompt = getPromptById(id);
  const [values, setValues] = useState(() => createDefaultValues(prompt));
  const [copied, setCopied] = useState(false);

  const renderedPrompt = useMemo(() => renderPrompt(prompt, values), [prompt, values]);

  const updateValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const copyPrompt = async () => {
    await Clipboard.setStringAsync(renderedPrompt);
    haptic.success();
    setCopied(true);
    setTimeout(() => setCopied(false), 1700);
  };

  const openChatGPT = async () => {
    await copyPrompt();
    try {
      await Linking.openURL("https://chatgpt.com/");
    } catch {
      Alert.alert("Prompt copied", "Your prompt is ready on the clipboard. Open ChatGPT and paste it into a new chat.");
    }
  };

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right", "bottom"]} containerClassName="bg-background">
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <MaterialIcons name="arrow-back" size={22} color="#10233E" />
        </Pressable>
        <Text style={styles.headerTitle}>Prompt studio</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.categoryBadge, { backgroundColor: `${prompt.accent}18` }]}>
          <Text style={[styles.categoryText, { color: prompt.accent }]}>{prompt.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{prompt.title}</Text>
        <Text style={styles.summary}>{prompt.summary}</Text>

        {prompt.safetyNote ? (
          <View style={styles.noteCard}>
            <MaterialIcons name="info-outline" size={19} color="#A15923" />
            <Text style={styles.noteText}>{prompt.safetyNote}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Tailor the brief</Text>
        {prompt.fields.map((field) => (
          <View key={field.key} style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{field.label.toUpperCase()}{field.optional ? " · OPTIONAL" : ""}</Text>
            <TextInput
              value={values[field.key]}
              onChangeText={(value) => updateValue(field.key, value)}
              placeholder={field.placeholder}
              placeholderTextColor="#88919E"
              multiline={field.multiline}
              textAlignVertical={field.multiline ? "top" : "center"}
              selectionColor="#146C94"
              style={[styles.input, field.multiline && styles.inputMultiline]}
            />
          </View>
        ))}

        <View style={styles.previewHeader}>
          <Text style={styles.sectionTitle}>Prompt preview</Text>
          <Text style={styles.previewHint}>Ready to copy</Text>
        </View>
        <View style={styles.previewCard}>
          <Text selectable style={styles.previewText}>{renderedPrompt}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable onPress={copyPrompt} style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}>
          <MaterialIcons name={copied ? "check" : "content-copy"} size={19} color="#10233E" />
          <Text style={styles.copyButtonText}>{copied ? "Copied" : "Copy"}</Text>
        </Pressable>
        <Pressable onPress={openChatGPT} style={({ pressed }) => [styles.openButton, pressed && styles.pressed]}>
          <Text style={styles.openButtonText}>Open ChatGPT</Text>
          <MaterialIcons name="open-in-new" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingTop: 6 },
  backButton: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E2E7EC", borderRadius: 14, borderWidth: 1, height: 42, justifyContent: "center", width: 42 },
  headerTitle: { color: "#10233E", fontSize: 15, fontWeight: "800" },
  headerSpacer: { width: 42 },
  content: { paddingBottom: 24, paddingTop: 21 },
  categoryBadge: { alignSelf: "flex-start", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  categoryText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: "#10233E", fontSize: 30, fontWeight: "800", letterSpacing: -0.85, marginTop: 12 },
  summary: { color: "#687281", fontSize: 15, lineHeight: 21, marginTop: 7 },
  noteCard: { alignItems: "flex-start", backgroundColor: "#FFF5E8", borderColor: "#F1D6B4", borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: 9, marginTop: 17, padding: 13 },
  noteText: { color: "#76542C", flex: 1, fontSize: 12, lineHeight: 17 },
  sectionTitle: { color: "#10233E", fontSize: 18, fontWeight: "800" },
  fieldGroup: { marginTop: 17 },
  fieldLabel: { color: "#687281", fontSize: 10, fontWeight: "800", letterSpacing: 1.05, marginBottom: 7 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 15, borderWidth: 1, color: "#10233E", fontSize: 15, minHeight: 50, paddingHorizontal: 13, paddingVertical: 10 },
  inputMultiline: { minHeight: 105, paddingTop: 12 },
  previewHeader: { alignItems: "baseline", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, marginTop: 27 },
  previewHint: { color: "#3F7F69", fontSize: 11, fontWeight: "800" },
  previewCard: { backgroundColor: "#F1F4F6", borderColor: "#DBE1E5", borderRadius: 18, borderWidth: 1, padding: 15 },
  previewText: { color: "#2D4256", fontFamily: "Courier", fontSize: 12, lineHeight: 18 },
  bottomBar: { backgroundColor: "#F7F5F0", borderTopColor: "#E1E6EA", borderTopWidth: 1, flexDirection: "row", gap: 10, paddingBottom: 5, paddingTop: 12 },
  copyButton: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 14, borderWidth: 1, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 48, paddingHorizontal: 17 },
  copyButtonText: { color: "#10233E", fontSize: 14, fontWeight: "800" },
  openButton: { alignItems: "center", backgroundColor: "#146C94", borderRadius: 14, flex: 1, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 48 },
  openButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});
