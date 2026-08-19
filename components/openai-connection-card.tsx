import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { startOAuthLogin } from "@/constants/oauth";
import { useAuth } from "@/hooks/use-auth";
import { haptic } from "@/lib/haptics";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function OpenAIConnectionCard() {
  const { isAuthenticated, loading, user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const connection = trpc.openai.status.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const connect = trpc.openai.connect.useMutation();
  const disconnect = trpc.openai.disconnect.useMutation();

  const openEditor = () => {
    setApiKey("");
    setError(null);
    setIsEditorOpen(true);
  };

  const saveKey = async () => {
    if (!apiKey.trim()) {
      setError("Enter an OpenAI Platform API key to continue.");
      return;
    }

    try {
      setError(null);
      await connect.mutateAsync({ apiKey: apiKey.trim() });
      haptic.success();
      setApiKey("");
      setIsEditorOpen(false);
      await connection.refetch();
    } catch (reason) {
      setApiKey("");
      setError(reason instanceof Error ? reason.message : "We could not validate that key. Create a new OpenAI Platform key and try again.");
    }
  };

  const removeKey = () => {
    Alert.alert("Disconnect OpenAI", "This permanently removes the encrypted key saved for your account. You can reconnect any time.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: async () => {
          await disconnect.mutateAsync();
          haptic.success();
          await connection.refetch();
        },
      },
    ]);
  };

  const connected = Boolean(connection.data?.connected);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.headline}>
          <View style={styles.iconPlate}>
            <MaterialIcons name="auto-awesome" size={21} color="#6C5BA7" />
          </View>
          <View style={styles.headlineCopy}>
            <Text style={styles.kicker}>YOUR AI CONNECTION</Text>
            <Text style={styles.title}>OpenAI Platform</Text>
          </View>
          <View style={[styles.statusDot, connected ? styles.statusOnline : styles.statusOffline]} />
        </View>

        {loading ? (
          <View style={styles.stateRow}><ActivityIndicator size="small" color="#146C94" /><Text style={styles.stateText}>Checking your account…</Text></View>
        ) : !isAuthenticated ? (
          <>
            <Text style={styles.body}>Sign in first, then connect your own OpenAI Platform API key. The key is encrypted on the server and never placed in the mobile app.</Text>
            <Pressable onPress={() => void startOAuthLogin()} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryButtonText}>Sign in to connect</Text>
              <MaterialIcons name="login" size={18} color="#FFFFFF" />
            </Pressable>
          </>
        ) : connected ? (
          <>
            <Text style={styles.body}>Connected for {user?.name ?? "your account"}. Your stored key is masked as {connection.data?.keyHint}; assistant requests use only this account’s connection.</Text>
            <View style={styles.buttonRow}>
              <Pressable onPress={openEditor} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                <Text style={styles.secondaryButtonText}>Replace key</Text>
              </Pressable>
              <Pressable onPress={removeKey} disabled={disconnect.isPending} style={({ pressed }) => [styles.removeButton, pressed && styles.pressed, disconnect.isPending && styles.disabled]}>
                <Text style={styles.removeButtonText}>{disconnect.isPending ? "Removing…" : "Disconnect"}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.body}>Add a personal OpenAI Platform API key to use Prompt Bridge’s assistant. ChatGPT subscriptions and Expo credentials cannot be used for this connection.</Text>
            <Pressable onPress={openEditor} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryButtonText}>Connect OpenAI</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>
          </>
        )}
      </View>

      <Modal visible={isEditorOpen} animationType="slide" transparent onRequestClose={() => setIsEditorOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalKicker}>ACCOUNT CONNECTION</Text>
            <Text style={styles.modalTitle}>Connect your OpenAI key</Text>
            <Text style={styles.modalBody}>Create an API key at platform.openai.com/api-keys. It is separate from ChatGPT and Expo. Prompt Bridge sends it over HTTPS, validates it, encrypts it on the server, and never shows it again.</Text>
            <Text style={styles.inputLabel}>OPENAI PLATFORM API KEY</Text>
            <TextInput
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              placeholder="Paste your API key"
              placeholderTextColor="#88919E"
              selectionColor="#146C94"
              style={styles.keyInput}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable onPress={() => void saveKey()} disabled={connect.isPending} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed, connect.isPending && styles.disabled]}>
              <Text style={styles.saveButtonText}>{connect.isPending ? "Validating…" : "Validate and save"}</Text>
              {connect.isPending ? <ActivityIndicator size="small" color="#FFFFFF" /> : <MaterialIcons name="lock" size={17} color="#FFFFFF" />}
            </Pressable>
            <Pressable onPress={() => { setApiKey(""); setError(null); setIsEditorOpen(false); }} style={({ pressed }) => [styles.cancelButton, pressed && styles.textPressed]}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#F3EFFA", borderColor: "#DDD4EE", borderRadius: 20, borderWidth: 1, marginTop: 19, padding: 15 },
  headline: { alignItems: "center", flexDirection: "row" },
  iconPlate: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12, height: 41, justifyContent: "center", width: 41 },
  headlineCopy: { flex: 1, marginLeft: 10 },
  kicker: { color: "#6C5BA7", fontSize: 10, fontWeight: "800", letterSpacing: 1.05 },
  title: { color: "#322657", fontSize: 16, fontWeight: "800", marginTop: 2 },
  statusDot: { borderRadius: 5, height: 10, width: 10 },
  statusOnline: { backgroundColor: "#3F7F69" },
  statusOffline: { backgroundColor: "#C47032" },
  body: { color: "#5B5077", fontSize: 13, lineHeight: 19, marginTop: 12 },
  stateRow: { alignItems: "center", flexDirection: "row", gap: 8, marginTop: 13 },
  stateText: { color: "#5B5077", fontSize: 13 },
  primaryButton: { alignItems: "center", backgroundColor: "#6C5BA7", borderRadius: 13, flexDirection: "row", gap: 7, justifyContent: "center", marginTop: 15, minHeight: 45 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  buttonRow: { flexDirection: "row", gap: 9, marginTop: 15 },
  secondaryButton: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#CBBFE4", borderRadius: 12, borderWidth: 1, flex: 1, justifyContent: "center", minHeight: 43 },
  secondaryButtonText: { color: "#5A4A91", fontSize: 13, fontWeight: "800" },
  removeButton: { alignItems: "center", borderColor: "#C67782", borderRadius: 12, borderWidth: 1, flex: 1, justifyContent: "center", minHeight: 43 },
  removeButtonText: { color: "#A73F50", fontSize: 13, fontWeight: "800" },
  modalBackdrop: { backgroundColor: "rgba(16, 35, 62, 0.46)", flex: 1, justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#F7F5F0", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22 },
  modalHandle: { alignSelf: "center", backgroundColor: "#C6CDD4", borderRadius: 3, height: 5, marginBottom: 20, width: 42 },
  modalKicker: { color: "#6C5BA7", fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  modalTitle: { color: "#10233E", fontSize: 25, fontWeight: "800", letterSpacing: -0.5, marginTop: 5 },
  modalBody: { color: "#687281", fontSize: 14, lineHeight: 20, marginTop: 8 },
  inputLabel: { color: "#687281", fontSize: 10, fontWeight: "800", letterSpacing: 1.05, marginBottom: 7, marginTop: 19 },
  keyInput: { backgroundColor: "#FFFFFF", borderColor: "#D5DCE3", borderRadius: 14, borderWidth: 1, color: "#10233E", fontSize: 15, minHeight: 50, paddingHorizontal: 13 },
  errorText: { color: "#A73F50", fontSize: 12, lineHeight: 17, marginTop: 8 },
  saveButton: { alignItems: "center", backgroundColor: "#6C5BA7", borderRadius: 14, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 16, minHeight: 48 },
  saveButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  cancelButton: { alignItems: "center", marginTop: 8, minHeight: 42, justifyContent: "center" },
  cancelButtonText: { color: "#687281", fontSize: 14, fontWeight: "700" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  textPressed: { opacity: 0.55 },
  disabled: { opacity: 0.55 },
});
