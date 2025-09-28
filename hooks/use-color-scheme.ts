import { useTheme } from "@/lib/theme-context";

export function useColorScheme() {
  const { isDark } = useTheme();
  return isDark ? "dark" : "light";
}
