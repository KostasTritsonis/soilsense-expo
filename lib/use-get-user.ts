import { useUser } from "@clerk/clerk-expo";

export default function useGetUser() {
  const { user, isLoaded } = useUser();

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
