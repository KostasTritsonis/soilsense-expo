import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect } from "react";

export default function useGetUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !user) {
      // Navigate to the main tabs instead of a non-existent sign-in route
      router.replace("/(tabs)");
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return null;
  }

  // Return user data in the format expected by the app
  return {
    id: user.id,
    name: user.fullName || user.firstName || "Unknown",
    email: user.emailAddresses[0]?.emailAddress || "",
  };
}
