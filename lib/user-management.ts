import { supabase } from "./supabase";
import { User } from "./types";

// User management functions for automatic user creation
export const userManagement = {
  /**
   * Check if a user exists in the database
   */
  async checkUserExists(clerkUserId: string): Promise<boolean> {
    try {
      console.log("🔍 Checking if user exists:", clerkUserId);

      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", clerkUserId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // PGRST116 = no rows returned (user doesn't exist)
          console.log("👤 User not found in database");
          return false;
        }
        console.error("❌ Error checking user existence:", error);
        return false;
      }

      console.log("✅ User found in database");
      return !!data;
    } catch (error) {
      console.error("❌ Error checking user existence:", error);
      return false;
    }
  },

  /**
   * Create a new user in the database
   */
  async createUser(clerkUser: any): Promise<User | null> {
    try {
      console.log("➕ Creating new user:", clerkUser.id);

      const userData = {
        id: clerkUser.id,
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "Unknown User",
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
      };

      console.log("📝 User data to insert:", userData);

      const { data, error } = await supabase
        .from("users")
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating user:", error);
        return null;
      }

      console.log("✅ User created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creating user:", error);
      return null;
    }
  },

  /**
   * Get user from database
   */
  async getUser(clerkUserId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", clerkUserId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  /**
   * Update user information
   */
  async updateUser(
    clerkUserId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", clerkUserId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  },

  /**
   * Ensure user exists in database (create if not exists)
   * This is the main function to call when a user connects
   */
  async ensureUserExists(clerkUser: any): Promise<User | null> {
    try {
      console.log("🔍 Checking if user exists in database...");

      const exists = await this.checkUserExists(clerkUser.id);

      if (exists) {
        console.log("✅ User already exists in database");
        return await this.getUser(clerkUser.id);
      } else {
        console.log("👤 User not found, creating new user...");
        return await this.createUser(clerkUser);
      }
    } catch (error) {
      console.error("❌ Error ensuring user exists:", error);
      return null;
    }
  },
};
