import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

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
        <Text className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
          {text}
        </Text>
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
          <Text className="text-white font-bold text-2xl">S</Text>
        </View>
        <View className="items-center">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {text}
          </Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400">
            Agricultural Intelligence
          </Text>
        </View>
      </View>

      {/* Loading Animation */}
      <View className="flex-row items-center gap-3">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>

      {/* Loading Text */}
      <Text className="text-base text-neutral-500 dark:text-neutral-400 font-medium">
        Loading your agricultural data...
      </Text>
    </View>
  );
}
