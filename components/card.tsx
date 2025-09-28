import React from "react";
import { Text, View } from "react-native";
import { ThemedView } from "./themed-view";

type CardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

export default function Card({ title, value, subtitle, icon }: CardProps) {
  return (
    <ThemedView className="bg-white dark:bg-neutral-800 rounded-3xl shadow-md border border-soil-200/80 dark:border-neutral-700/80 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
      <View className="flex-row items-center gap-3 pb-4">
        {icon && (
          <View className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors">
            {icon}
          </View>
        )}
        <Text className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
          {title}
        </Text>
      </View>
      <View className="flex-row items-baseline gap-2">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {value}
        </Text>
        {subtitle && (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            {subtitle}
          </Text>
        )}
      </View>
    </ThemedView>
  );
}
