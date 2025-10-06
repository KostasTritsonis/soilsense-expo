import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Get environment variables
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file or app.json configuration."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (you'll need to generate these from your Supabase schema)
export type Database = {
  public: {
    Tables: {
      fields: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          color: string;
          area: number;
          coordinates: number[][][];
          categories: { id: string; type: string }[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          color: string;
          area: number;
          coordinates: number[][][];
          categories: { id: string; type: string }[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          color?: string;
          area?: number;
          coordinates?: number[][][];
          categories?: { id: string; type: string }[];
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          status: "due" | "ongoing" | "completed";
          start_date: string;
          end_date: string;
          location: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          status: "due" | "ongoing" | "completed";
          start_date: string;
          end_date: string;
          location: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          status?: "due" | "ongoing" | "completed";
          start_date?: string;
          end_date?: string;
          location?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string; // TEXT field for Clerk user IDs
          name: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string; // Required for Clerk user IDs
          name: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
