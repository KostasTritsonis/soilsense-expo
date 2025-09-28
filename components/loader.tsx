import React from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemedText } from "./themed-text";

// Regular loader component for buttons and small areas
export default function Loader({
  size = "md",
  text = "",
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  const sizeClasses = {
    sm: 12,
    md: 16,
    lg: 24,
  };

  return (
    <View className="flex-row items-center justify-center">
      <ActivityIndicator
        size={sizeClasses[size]}
        color="#2563eb" // primary-600
      />
      {text && (
        <ThemedText type="default" className="ml-2 text-sm text-neutral-600">
          {text}
        </ThemedText>
      )}
    </View>
  );
}

// Full screen loader
export function FullScreenLoader({ text = "SoilSense" }: { text?: string }) {
  return (
    <View className="flex-col items-center space-y-8">
      {/* Logo and Brand */}
      <View className="flex-row items-center gap-4">
        <View className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-md">
          <ThemedText type="title" className="text-white font-bold text-2xl">
            S
          </ThemedText>
        </View>
        <View className="items-center">
          <ThemedText
            type="title"
            className="text-3xl font-bold text-neutral-900"
          >
            {text}
          </ThemedText>
          <ThemedText type="default" className="text-base text-neutral-500">
            Agricultural Intelligence
          </ThemedText>
        </View>
      </View>

      {/* Loading Animation */}
      <View className="flex-row items-center gap-3">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>

      {/* Loading Text */}
      <ThemedText
        type="defaultSemiBold"
        className="text-base text-neutral-500 font-medium"
      >
        Loading your agricultural data...
      </ThemedText>
    </View>
  );
}
