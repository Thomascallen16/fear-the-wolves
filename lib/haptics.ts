import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export const haptic = {
  light: () => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  success: () => {
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  selection: () => {
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }
  },
};
