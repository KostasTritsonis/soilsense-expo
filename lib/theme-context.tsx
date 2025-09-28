import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ColorScheme = "light" | "dark" | "system";

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@soilsense_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setColorSchemeState(savedTheme as ColorScheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      setColorSchemeState(scheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  // Determine if we should use dark mode
  const isDark =
    colorScheme === "dark" ||
    (colorScheme === "system" && systemColorScheme === "dark");

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
