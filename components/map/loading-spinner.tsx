import React from "react";
import { ActivityIndicator, View } from "react-native";

import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

export default function LoadingSpinner() {
  return (
    <ThemedView className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-3xl shadow-sm border border-white/60 z-30">
      <View className="flex-col items-center gap-4">
        <ActivityIndicator size="large" color="#2563eb" />
        <ThemedText
          type="default"
          className="text-sm text-neutral-600 font-medium"
        >
          Loading map...
        </ThemedText>
      </View>
    </ThemedView>
  );
}
