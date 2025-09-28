import { ClerkProvider } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { ThemeProvider as CustomThemeProvider } from "@/lib/theme-context";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { initializeData: initializeFields } = useFieldsStore();
  const { initializeData: initializeJobs } = useJobsStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize stores
        initializeFields();
        initializeJobs();
      } catch (error) {
        console.error("❌ Failed to initialize app:", error);
      }
    };

    initializeApp();
  }, [initializeFields, initializeJobs]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      >
        <CustomThemeProvider>
          <AppContent />
        </CustomThemeProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
