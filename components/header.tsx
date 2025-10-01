import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ThemeToggle } from "./theme-toggle";
import { ThemedView } from "./themed-view";

export default function Header() {
  const colorScheme = useColorScheme();
  const { user, isLoaded } = useUser();
  const { signOut, isSignedIn } = useAuth();

  // Debug logging
  console.log("Header Debug:", {
    isLoaded,
    isSignedIn,
    user: !!user,
    userId: user?.id,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <ThemedView className="w-full  px-4 py-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-soil-200/50 dark:border-neutral-700/50">
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
            <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              SoilSense
            </Text>
            <Text className="text-[8px] text-neutral-500 dark:text-neutral-400">
              Agricultural Intelligence
            </Text>
          </View>
        </View>

        {/* User Actions */}
        <View className="flex-row items-center gap-3">
          <ThemeToggle />
          {!isLoaded ? (
            <View className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-2xl flex items-center justify-center">
              <MaterialIcons name="hourglass-empty" size={20} color="#6b7280" />
            </View>
          ) : isSignedIn && user ? (
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => router.push("/profile")}
                className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-soil-600/25"
              >
                {user.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full bg-soil-600 flex items-center justify-center">
                    <MaterialIcons name="person" size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSignOut}
                className="w-10 h-10 bg-red-500 rounded-2xl flex items-center justify-center shadow-md shadow-red-500/25"
              >
                <MaterialIcons name="logout" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleSignIn}
              className="w-10 h-10 bg-soil-600 rounded-2xl flex items-center justify-center"
            >
              <MaterialIcons name="login" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ThemedView>
  );
}
