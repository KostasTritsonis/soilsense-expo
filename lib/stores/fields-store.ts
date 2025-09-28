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
  addField: (field: Field) => Promise<{ success: boolean; error?: string }>;
  updateField: (
    id: string,
    updates: Partial<Field>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteField: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Initialize with mock data
  initializeData: () => Promise<void>;
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
      const { fields } = get();
      set({ fields: [...fields, field] });
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
      const { fields } = get();
      const updatedFields = fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
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

  // Initialize with mock data
  initializeData: async () => {
    set({ isLoading: true });

    try {
      // Mock data for now
      const mockFields: Field[] = [
        {
          id: "field-1",
          color: "#3b82f6",
          area: 2.5,
          label: "North Field",
          coordinates: [
            [
              [37.7749, -122.4194],
              [37.7849, -122.4094],
              [37.7849, -122.4294],
              [37.7749, -122.4194],
            ],
          ],
          authorId: "mock-user-id",
          categories: [{ id: "cat-wheat", type: "Wheat" }],
        },
        {
          id: "field-2",
          color: "#10b981",
          area: 1.8,
          label: "South Field",
          coordinates: [
            [
              [37.7649, -122.4094],
              [37.7749, -122.3994],
              [37.7749, -122.4194],
              [37.7649, -122.4094],
            ],
          ],
          authorId: "mock-user-id",
          categories: [{ id: "cat-corn", type: "Corn" }],
        },
      ];

      set({
        fields: mockFields,
        isInitialized: true,
      });

      console.log("FieldsStore: Mock data loaded successfully");
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
}));
