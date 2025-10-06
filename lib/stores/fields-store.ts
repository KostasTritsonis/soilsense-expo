import { fieldsApi } from "@/lib/supabase-api";
import { Field } from "@/lib/types";
import { create } from "zustand";

interface FieldsState {
  // State
  fields: Field[];
  tempFields: Field[];
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setFields: (fields: Field[]) => void;
  setTempFields: (tempFields: Field[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;

  // Field actions
  addField: (
    field: Omit<Field, "id" | "isUpdating">
  ) => Promise<{ success: boolean; error?: string }>;
  updateField: (
    id: string,
    updates: Partial<Field>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteField: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Initialize with Supabase data
  initializeData: (userId: string) => Promise<void>;

  // Clear all data (for sign out)
  clearData: () => void;
}

export const useFieldsStore = create<FieldsState>((set, get) => ({
  // Initial state
  fields: [],
  tempFields: [],
  isLoading: true,
  isInitialized: false,

  // Basic setters
  setFields: (fields) => set({ fields }),
  setTempFields: (tempFields) => set({ tempFields }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),

  // Field actions
  addField: async (field) => {
    try {
      const newField = await fieldsApi.createField(field);
      const { fields } = get();
      set({ fields: [...fields, newField] });
      return { success: true };
    } catch (error) {
      console.error("Error adding field:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add field",
      };
    }
  },

  updateField: async (id, updates) => {
    try {
      const updatedField = await fieldsApi.updateField(id, updates);
      const { fields } = get();
      const updatedFields = fields.map((field) =>
        field.id === id ? updatedField : field
      );
      set({ fields: updatedFields });
      return { success: true };
    } catch (error) {
      console.error("Error updating field:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update field",
      };
    }
  },

  deleteField: async (id) => {
    try {
      await fieldsApi.deleteField(id);
      const { fields } = get();
      const filteredFields = fields.filter((field) => field.id !== id);
      set({ fields: filteredFields });
      return { success: true };
    } catch (error) {
      console.error("Error deleting field:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete field",
      };
    }
  },

  // Initialize with Supabase data
  initializeData: async (userId: string) => {
    set({ isLoading: true });

    try {
      const fields = await fieldsApi.getFields(userId);
      set({
        fields,
        isInitialized: true,
      });

      console.log("FieldsStore: Data loaded successfully from Supabase");
    } catch (error) {
      console.error("Error initializing fields data:", error);
      set({
        fields: [],
        isInitialized: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear all data (for sign out)
  clearData: () => {
    console.log("🧹 Clearing fields data");
    set({
      fields: [],
      tempFields: [],
      isLoading: false,
      isInitialized: false,
    });
  },
}));
