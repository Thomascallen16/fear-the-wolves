import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PromptCard } from "@/components/prompt-card";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { promptTemplates } from "@/lib/prompt-data";

const spotlight = promptTemplates.find((prompt) => prompt.id === "claim-audit") ?? promptTemplates[0];
const purposeCards = [
  { title: "Research", icon: "travel-explore" as const, color: "#3F7F69", href: "/(tabs)/library" },
  { title: "Creative", icon: "palette" as const, color: "#B15D8B", href: "/(tabs)/library" },
  { title: "Trades", icon: "handyman" as const, color: "#C47032", href: "/(tabs)/library" },
  { title: "Everyday", icon: "wb-sunny" as const, color: "#687281", href: "/(tabs)/library" },
];

export default function HomeScreen() {
  const openLibrary = () => {
    haptic.light();
    router.push("/library" as never);
  };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topline}>
          <View>
            <Text style={styles.eyebrow}>PROMPT BRIDGE</Text>
            <Text style={styles.title}>Ask with more shape.</Text>
          </View>
          <View style={styles.mark}>
            <MaterialIcons name="auto-awesome" size={22} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>LOCAL-FIRST WORKBENCH</Text>
            <View style={styles.heroDot} />
          </View>
          <Text style={styles.heroTitle}>Make the next ChatGPT chat count.</Text>
          <Text style={styles.heroBody}>Choose a purpose, tailor the details, and leave with a clean prompt you can trust yourself to reuse.</Text>
          <Pressable onPress={openLibrary} style={({ pressed }) => [styles.heroButton, pressed && styles.pressed]}>
            <Text style={styles.heroButtonText}>Build a prompt</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#10233E" />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Find your starting point</Text>
          <Pressable onPress={openLibrary} style={({ pressed }) => [styles.textButton, pressed && styles.textPressed]}>
            <Text style={styles.textButtonLabel}>View all</Text>
          </Pressable>
        </View>
        <View style={styles.purposeGrid}>
          {purposeCards.map((purpose) => (
            <Pressable key={purpose.title} onPress={openLibrary} style={({ pressed }) => [styles.purposeCard, pressed && styles.pressed]}>
              <View style={[styles.iconPlate, { backgroundColor: `${purpose.color}18` }]}>
                <MaterialIcons name={purpose.icon} color={purpose.color} size={22} />
              </View>
              <Text style={styles.purposeTitle}>{purpose.title}</Text>
              <Text style={styles.purposeCaption}>Prompt pack</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.checkCard}>
          <View style={styles.checkIcon}>
            <MaterialIcons name="fact-check" size={22} color="#3F7F69" />
          </View>
          <View style={styles.checkCopy}>
            <Text style={styles.checkTitle}>Keep the evidence outside the chat.</Text>
            <Text style={styles.checkText}>Use the Research Kit to keep sources, questions, and handoffs compact.</Text>
          </View>
          <Pressable onPress={() => router.push("/kit" as never)} hitSlop={8} style={({ pressed }) => [styles.chevron, pressed && styles.textPressed]}>
            <MaterialIcons name="chevron-right" size={24} color="#146C94" />
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, styles.recentTitle]}>A useful place to begin</Text>
        <PromptCard prompt={spotlight} onPress={() => router.push({ pathname: "/prompt/[id]" as never, params: { id: spotlight.id } })} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 36, paddingTop: 14 },
  topline: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  eyebrow: { color: "#146C94", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  title: { color: "#10233E", fontSize: 31, fontWeight: "800", letterSpacing: -0.9, marginTop: 3 },
  mark: { alignItems: "center", backgroundColor: "#10233E", borderRadius: 16, height: 46, justifyContent: "center", width: 46 },
  hero: { backgroundColor: "#10233E", borderRadius: 26, padding: 22 },
  heroHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  heroLabel: { color: "#B7D9E9", fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  heroDot: { backgroundColor: "#F3A75A", borderRadius: 5, height: 9, width: 9 },
  heroTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "800", letterSpacing: -0.8, lineHeight: 34, marginTop: 16, maxWidth: 280 },
  heroBody: { color: "#C9D6E0", fontSize: 15, lineHeight: 21, marginTop: 10 },
  heroButton: { alignItems: "center", alignSelf: "flex-start", backgroundColor: "#F7F5F0", borderRadius: 14, flexDirection: "row", gap: 8, marginTop: 19, paddingHorizontal: 15, paddingVertical: 12 },
  heroButtonText: { color: "#10233E", fontSize: 14, fontWeight: "800" },
  pressed: { opacity: 0.83, transform: [{ scale: 0.985 }] },
  sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 27 },
  sectionTitle: { color: "#10233E", fontSize: 18, fontWeight: "800", letterSpacing: -0.2 },
  textButton: { padding: 5 },
  textButtonLabel: { color: "#146C94", fontSize: 13, fontWeight: "700" },
  textPressed: { opacity: 0.55 },
  purposeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 11, marginTop: 13 },
  purposeCard: { backgroundColor: "#FFFFFF", borderColor: "#E5E8EC", borderRadius: 18, borderWidth: 1, padding: 14, width: "48.2%" },
  iconPlate: { alignItems: "center", borderRadius: 12, height: 38, justifyContent: "center", width: 38 },
  purposeTitle: { color: "#10233E", fontSize: 15, fontWeight: "800", marginTop: 12 },
  purposeCaption: { color: "#687281", fontSize: 12, marginTop: 2 },
  checkCard: { alignItems: "center", backgroundColor: "#EDF7F1", borderColor: "#CCE7D6", borderRadius: 19, borderWidth: 1, flexDirection: "row", marginTop: 25, padding: 14 },
  checkIcon: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 13, height: 42, justifyContent: "center", width: 42 },
  checkCopy: { flex: 1, marginLeft: 11 },
  checkTitle: { color: "#225D49", fontSize: 14, fontWeight: "800" },
  checkText: { color: "#527765", fontSize: 12, lineHeight: 17, marginTop: 3 },
  chevron: { marginLeft: 6, padding: 4 },
  recentTitle: { marginBottom: 12, marginTop: 27 },
});
