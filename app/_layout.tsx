import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { ThemeProvider as CustomThemeProvider } from "@/lib/theme-context";
import { userManagement } from "@/lib/user-management";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { initializeData: initializeFields, clearData: clearFieldsData } =
    useFieldsStore();
  const { initializeData: initializeJobs, clearData: clearJobsData } =
    useJobsStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (isSignedIn && user?.id) {
          console.log("🚀 Initializing app for user:", user.id);

          // First, ensure user exists in database
          const dbUser = await userManagement.ensureUserExists(user);

          if (dbUser) {
            console.log("✅ User ready in database:", dbUser.name);

            // Initialize stores with user ID
            await initializeFields(user.id);
            await initializeJobs(user.id);

            console.log("✅ App initialization complete");
          } else {
            console.error("❌ Failed to ensure user exists in database");
          }
        }
      } catch (error) {
        console.error("❌ Failed to initialize app:", error);
      }
    };

    if (isLoaded) {
      initializeApp();
    }
  }, [initializeFields, initializeJobs, isSignedIn, user, isLoaded]);

  // Handle sign out - clear data when user signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log("🚪 User signed out, clearing app data...");
      clearFieldsData();
      clearJobsData();
      console.log("✅ App data cleared after sign out");
    }
  }, [isLoaded, isSignedIn, clearFieldsData, clearJobsData]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="profile"
              options={{
                presentation: "modal",
                headerShown: false,
                animationTypeForReplace: "push",
                animation: "slide_from_bottom",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
          <CustomThemeProvider>
            <AppContent />
          </CustomThemeProvider>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
