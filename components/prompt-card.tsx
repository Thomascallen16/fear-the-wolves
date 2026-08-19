import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PromptTemplate } from "@/lib/prompt-data";

type PromptCardProps = {
  prompt: PromptTemplate;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
};

export function PromptCard({ prompt, onPress, onFavorite, isFavorite = false }: PromptCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.accent, { backgroundColor: prompt.accent }]} />
      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text style={[styles.category, { color: prompt.accent }]}>{prompt.category.toUpperCase()}</Text>
          {onFavorite ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${isFavorite ? "Remove" : "Add"} ${prompt.title} ${isFavorite ? "from" : "to"} favorites`}
              hitSlop={10}
              onPress={(event) => {
                event.stopPropagation();
                onFavorite();
              }}
              style={({ pressed }) => [styles.favorite, pressed && styles.iconPressed]}
            >
              <MaterialIcons name={isFavorite ? "bookmark" : "bookmark-border"} size={21} color={isFavorite ? prompt.accent : "#687281"} />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.title}>{prompt.title}</Text>
        <Text style={styles.summary}>{prompt.summary}</Text>
        <View style={styles.footer}>
          <Text style={styles.action}>Build prompt</Text>
          <MaterialIcons name="arrow-forward" size={16} color={prompt.accent} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E8EC",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 146,
    overflow: "hidden",
  },
  pressed: { opacity: 0.84, transform: [{ scale: 0.985 }] },
  accent: { width: 5 },
  content: { flex: 1, padding: 16 },
  topLine: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  category: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  favorite: { height: 28, justifyContent: "center", width: 28, alignItems: "center" },
  iconPressed: { opacity: 0.55 },
  title: { color: "#10233E", fontSize: 19, fontWeight: "700", marginTop: 5 },
  summary: { color: "#687281", fontSize: 14, lineHeight: 20, marginTop: 5 },
  footer: { alignItems: "center", flexDirection: "row", gap: 5, marginTop: 13 },
  action: { color: "#146C94", fontSize: 13, fontWeight: "700" },
});
