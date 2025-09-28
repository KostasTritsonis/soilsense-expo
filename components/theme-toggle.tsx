import { useThemeColor } from "@/hooks/use-theme-color";
import { useTheme } from "@/lib/theme-context";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface ThemeToggleProps {
  size?: number;
  className?: string;
}

export function ThemeToggle({ size = 24, className }: ThemeToggleProps) {
  const { isDark, setColorScheme } = useTheme();
  const iconColor = useThemeColor({}, "icon");

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`p-2 rounded-full ${className || ""}`}
      style={{ backgroundColor: useThemeColor({}, "surface") }}
    >
      <MaterialIcons
        name={isDark ? "light-mode" : "dark-mode"}
        size={size}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}
