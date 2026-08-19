import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PromptCard } from "@/components/prompt-card";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { promptCategories, promptTemplates, type PromptCategory } from "@/lib/prompt-data";
import { loadFavorites, saveFavorites } from "@/lib/storage";

export default function LibraryScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | PromptCategory>("All");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    void loadFavorites().then(setFavorites);
  }, []);

  const visiblePrompts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return promptTemplates.filter((prompt) => {
      const matchesCategory = category === "All" || prompt.category === category;
      const haystack = `${prompt.title} ${prompt.summary} ${prompt.category}`.toLowerCase();
      return matchesCategory && (!term || haystack.includes(term));
    });
  }, [category, search]);

  const toggleFavorite = (id: string) => {
    haptic.selection();
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id];
      void saveFavorites(next);
      return next;
    });
  };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <FlatList
        data={visiblePrompts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>PROMPT LIBRARY</Text>
            <Text style={styles.title}>Useful language, ready when you are.</Text>
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={21} color="#687281" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search prompts, careers, tasks"
                placeholderTextColor="#88919E"
                returnKeyType="search"
                selectionColor="#146C94"
                style={styles.searchInput}
              />
              {search ? (
                <Pressable onPress={() => setSearch("")} hitSlop={10} style={styles.clearButton}>
                  <MaterialIcons name="close" size={18} color="#687281" />
                </Pressable>
              ) : null}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {promptCategories.map((item) => {
                const isActive = category === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => {
                      haptic.selection();
                      setCategory(item);
                    }}
                    style={({ pressed }) => [styles.chip, isActive && styles.chipActive, pressed && styles.chipPressed]}
                  >
                    <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{item}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={styles.resultsRow}>
              <Text style={styles.resultsText}>{visiblePrompts.length} prompts</Text>
              <Text style={styles.resultsHint}>Tap one to tailor it</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PromptCard
            prompt={item}
            isFavorite={favorites.includes(item.id)}
            onFavorite={() => toggleFavorite(item.id)}
            onPress={() => router.push({ pathname: "/prompt/[id]" as never, params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={30} color="#687281" />
            <Text style={styles.emptyTitle}>No prompt fits that search yet.</Text>
            <Text style={styles.emptyText}>Try a career, task, or category such as “trades,” “records,” or “creative.”</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 36, paddingTop: 14 },
  eyebrow: { color: "#146C94", fontSize: 11, fontWeight: "800", letterSpacing: 1.35 },
  title: { color: "#10233E", fontSize: 28, fontWeight: "800", letterSpacing: -0.75, lineHeight: 34, marginTop: 5, maxWidth: 330 },
  searchBox: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#DCE2E8", borderRadius: 16, borderWidth: 1, flexDirection: "row", marginTop: 19, paddingHorizontal: 13 },
  searchInput: { color: "#10233E", flex: 1, fontSize: 15, height: 49, marginLeft: 9 },
  clearButton: { padding: 4 },
  chipRow: { gap: 8, paddingBottom: 4, paddingTop: 14 },
  chip: { backgroundColor: "#FFFFFF", borderColor: "#DDE3E8", borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  chipActive: { backgroundColor: "#10233E", borderColor: "#10233E" },
  chipPressed: { opacity: 0.72 },
  chipLabel: { color: "#51606E", fontSize: 13, fontWeight: "700" },
  chipLabelActive: { color: "#FFFFFF" },
  resultsRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12, marginTop: 16 },
  resultsText: { color: "#10233E", fontSize: 14, fontWeight: "800" },
  resultsHint: { color: "#687281", fontSize: 12 },
  emptyState: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 20, marginTop: 18, padding: 28 },
  emptyTitle: { color: "#10233E", fontSize: 16, fontWeight: "800", marginTop: 12 },
  emptyText: { color: "#687281", fontSize: 13, lineHeight: 19, marginTop: 5, textAlign: "center" },
});
