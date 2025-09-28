import { useColorScheme } from "@/hooks/use-color-scheme";
import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemeToggle } from "./theme-toggle";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export default function Header() {
  const colorScheme = useColorScheme();

  // Handle Clerk not being configured
  let isSignedIn = false;
  try {
    const user = useUser();
    isSignedIn = user?.isSignedIn ?? false;
  } catch {
    // Clerk not configured, user is not signed in
    isSignedIn = false;
  }

  return (
    <ThemedView className="w-full px-4 py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-soil-200/50 dark:border-neutral-700/50">
      <View className="flex-row items-center justify-between">
        {/* Logo Section */}
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <MaterialIcons
              name="eco"
              size={24}
              color={colorScheme === "dark" ? "white" : "#16a34a"}
            />
          </View>
          <View>
            <ThemedText
              type="title"
              className="text-xl font-bold text-neutral-900 dark:text-neutral-100"
            >
              SoilSense
            </ThemedText>
            <ThemedText
              type="default"
              className="text-xs text-neutral-500 dark:text-neutral-400"
            >
              Agricultural Intelligence
            </ThemedText>
          </View>
        </View>

        {/* User Actions */}
        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <TouchableOpacity className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-md shadow-primary-600/25">
              <MaterialIcons name="person" size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="px-4 py-2 bg-primary-600 rounded-2xl shadow-md shadow-primary-600/25">
              <ThemedText
                type="defaultSemiBold"
                className="text-white font-semibold text-sm"
              >
                Sign In
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ThemedView>
  );
}
