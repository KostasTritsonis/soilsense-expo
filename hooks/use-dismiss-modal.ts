import { router } from "expo-router";
import { useCallback } from "react";

/**
 * Custom hook that provides a dismissModal function for modal screens
 * This ensures consistent modal dismissal behavior across the app
 */
export function useDismissModal() {
  const dismissModal = useCallback(() => {
    router.dismiss();
  }, []);

  return { dismissModal };
}
